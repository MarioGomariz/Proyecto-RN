import { supabase } from '../api/supabase';

export interface NewProductData {
  nombre: string;
  descripcion?: string;
  tag: string;
  stock_actual: number;
}

export const productService = {

  async createProduct(data: NewProductData) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: result, error } = await supabase
      .from('productos')
      .insert([
        {
          nombre: data.nombre.trim(),
          descripcion: data.descripcion?.trim() || null,
          tag: data.tag.trim(),
          stock_actual: data.stock_actual,
          created_by: user?.id,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getProducts() {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    if (user) {
      query = query.eq('created_by', user.id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getProductById(id: string) {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('productos')
      .select('*')
      .eq('id', id);

    if (user) {
      query = query.eq('created_by', user.id);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data;
  },

  async registerMovement(productoId: string, tipo: 'ingreso' | 'egreso', cantidad: number, observaciones?: string) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: result, error } = await supabase
      .from('movimientos_stock')
      .insert([
        {
          producto_id: productoId,
          tipo,
          cantidad,
          observaciones: observaciones?.trim() || null,
          created_by: user?.id,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async getProductHistory(productoId: string) {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('movimientos_stock')
      .select('*')
      .eq('producto_id', productoId)
      .order('created_at', { ascending: false });

    if (user) {
      query = query.eq('created_by', user.id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
};
