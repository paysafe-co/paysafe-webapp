import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useDashboardData = () => {
  const [merchants, setMerchants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [aggregates, setAggregates] = useState({ escrowPool: 0, totalVolume: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAggregates = async () => {
    try {
      // In a real scenario, these would be complex aggregate queries or RPC calls
      const { data: escrowData, error: eError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'escrow_hold')
        .eq('status', 'completed');
      
      const { data: allData, error: aError } = await supabase
        .from('transactions')
        .select('amount');

      if (eError || aError) throw eError || aError;

      const escrowTotal = escrowData ? escrowData.reduce((sum, t) => sum + Number(t.amount), 0) : 0;
      const volumeTotal = allData ? allData.reduce((sum, t) => sum + Number(t.amount), 0) : 0;

      setAggregates({
        escrowPool: escrowTotal,
        totalVolume: volumeTotal
      });
    } catch (err) {
      console.error('Error fetching aggregates:', err);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending merchants
      const { data: pendingMerchants, error: mError } = await supabase
        .from('merchants')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (mError) throw mError;
      setMerchants(pendingMerchants || []);

      // Fetch recent transactions
      const { data: recentTransactions, error: tError } = await supabase
        .from('transactions')
        .select(`
          *,
          merchants (name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (tError) throw tError;
      setTransactions(recentTransactions || []);

      await fetchAggregates();

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveMerchant = async (merchantId) => {
    const { error } = await supabase
      .from('merchants')
      .update({ status: 'active' })
      .eq('id', merchantId);
    
    if (error) {
      console.error('Error approving merchant:', error);
      return { success: false, error };
    }
    
    setMerchants(prev => prev.filter(m => m.id !== merchantId));
    return { success: true };
  };

  const rejectMerchant = async (merchantId) => {
    const { error } = await supabase
      .from('merchants')
      .update({ status: 'suspended' })
      .eq('id', merchantId);
    
    if (error) {
      console.error('Error rejecting merchant:', error);
      return { success: false, error };
    }
    
    setMerchants(prev => prev.filter(m => m.id !== merchantId));
    return { success: true };
  };

  useEffect(() => {
    fetchInitialData();

    // Subscribe to merchants changes
    const merchantSubscription = supabase
      .channel('merchants_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'merchants' }, (payload) => {
        if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
          setMerchants(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          if (payload.new.status !== 'pending') {
            setMerchants(prev => prev.filter(m => m.id !== payload.new.id));
          } else {
            setMerchants(prev => {
              const exists = prev.find(m => m.id === payload.new.id);
              if (exists) return prev.map(m => m.id === payload.new.id ? payload.new : m);
              return [payload.new, ...prev];
            });
          }
        } else if (payload.eventType === 'DELETE') {
          setMerchants(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to transactions changes
    const transactionSubscription = supabase
      .channel('transactions_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, async (payload) => {
        // Fetch merchant name for the new transaction
        const { data: merchantData } = await supabase
          .from('merchants')
          .select('name')
          .eq('id', payload.new.merchant_id)
          .single();
        
        const newTransaction = {
          ...payload.new,
          merchants: merchantData || { name: 'Unknown' }
        };
        
        setTransactions(prev => [newTransaction, ...prev.slice(0, 19)]);
        
        // Update aggregates
        setAggregates(prev => ({
          escrowPool: payload.new.type === 'escrow_hold' && payload.new.status === 'completed' 
            ? prev.escrowPool + Number(payload.new.amount) 
            : prev.escrowPool,
          totalVolume: prev.totalVolume + Number(payload.new.amount)
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(merchantSubscription);
      supabase.removeChannel(transactionSubscription);
    };
  }, []);

  return {
    merchants,
    transactions,
    liquidityStats: { ...aggregates, merchantAdvances: 0 },
    loading,
    error,
    approveMerchant,
    rejectMerchant,
    refresh: fetchInitialData
  };
};
