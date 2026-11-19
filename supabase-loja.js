/* supabase-loja.js — carregue ANTES do script.js
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="supabase-loja.js"></script>
   <script src="script.js"></script>
*/
const SUPABASE_URL = "https://wqeptgfroqpjjwqnnxah.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_QvgQtJiKhpUwLYx6hMoJ8Q_5xXSaUbI";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.lojaDB = {
  async cadastrar(nome, email, senha) {
    const { data, error } = await sb.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });
    if (error) throw error;
    return data; // data.session é null se a confirmação por e-mail estiver ativa
  },

  async entrar(email, senha) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
    return data.user;
  },

  async sair() {
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  },

  async usuarioAtual() {
    const { data } = await sb.auth.getUser();
    return data.user;
  },

  async finalizarPedido(sacola) {
    const itens = sacola.map((i) => ({
      id: i.id,
      qty: i.qty,
      color: i.color ?? null,
      size: i.size ?? null,
    }));
    const { data, error } = await sb.rpc("finalizar_pedido", { itens });
    if (error) throw error;
    return data; // uuid do pedido
  },

  onAuthChange(callback) {
    sb.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
  },
};
