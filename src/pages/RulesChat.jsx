import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const EXAMPLES = [
  'Does deathtouch work with trample?',
  'Can I counter a spell with Split Second on the stack?',
  'How does the legend rule work with clones?',
  'When exactly can my opponent respond to my spell?',
  'What happens when two replacement effects apply to the same event?',
];

export default function RulesChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    if (!supabase) {
      setError('Supabase is not configured. Check your .env.local file.');
      return;
    }

    const userMsg = { role: 'user', content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const { data, error: fnErr } = await supabase.functions.invoke('mtg-rules-qa', {
        body: { messages: updated },
      });
      if (fnErr) throw fnErr;
      if (data?.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setError('Failed to get a response — ' + (e?.message ?? 'please try again.'));
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    setMessages([]);
    setError('');
  }

  return (
    <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && !loading && (
            <div className="chat-empty">
              <p>Ask anything — card interactions, timing, combat, layers, the stack...</p>
              <div className="chat-examples">
                {EXAMPLES.map(ex => (
                  <button key={ex} className="chat-example-btn" onClick={() => setInput(ex)}>
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
              <div className="chat-msg-label">{msg.role === 'user' ? 'You' : 'Rules AI'}</div>
              <div className="chat-msg-content">{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div className="chat-msg chat-msg-assistant">
              <div className="chat-msg-label">Rules AI</div>
              <div className="chat-msg-content chat-thinking">Looking up rules...</div>
            </div>
          )}

          {error && <p className="chat-error">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-row">
          <textarea
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a rules question… (Enter to send, Shift+Enter for new line)"
            rows={2}
            disabled={loading}
          />
          <div className="chat-input-actions">
            {messages.length > 0 && (
              <button className="btn-ghost-sm" onClick={clearChat}>Clear chat</button>
            )}
            <button className="btn-primary" onClick={send} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
  );
}
