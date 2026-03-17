import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../redux/actions/adminActions';
import { fetchMySubscription } from '../redux/actions/subscriptionActions';
import '../styles/ChatBot.css';

function ChatBot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const subscription = useSelector((state) => state.subscriptions.mySubscription);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I am your Auto Repair & Diagnostic Services assistant. How can I help you today?',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMySubscription()).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isSending) return;

    if (!subscription?.is_active) {
      setMessages([
        ...messages,
        { id: Date.now(), text: 'Please subscribe to use the chatbot', sender: 'bot' },
      ]);
      navigate('/subscription');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages([
      ...messages,
      { id: Date.now(), text: userMessage, sender: 'user' },
    ]);
    setIsSending(true);

    try {
      const response = await dispatch(sendChatMessage(userMessage));
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: response.response, sender: 'bot' },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Error: Unable to process your message. Please try again.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>Auto Repair Chatbot</h1>
        {subscription?.is_active && (
          <div className="usage-info">
            Usage Left: {subscription.usage_left}/{subscription.tier_name || 'Unknown'} tier
          </div>
        )}
      </div>

      {!subscription?.is_active ? (
        <div className="subscription-prompt">
          <p>You need an active subscription to use the chatbot.</p>
          <button onClick={() => navigate('/subscription')} className="btn-subscribe">
            Subscribe Now
          </button>
        </div>
      ) : (
        <>
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about our services..."
              disabled={isSending}
            />
            <button type="submit" disabled={isSending || !input.trim()}>
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default ChatBot;
