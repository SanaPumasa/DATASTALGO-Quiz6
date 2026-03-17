import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../redux/actions/adminActions';
import { fetchMySubscription } from '../redux/actions/subscriptionActions';
import * as types from '../redux/constants';
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
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMySubscription()).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
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

    if (subscription?.usage_left <= 0) {
      setMessages([
        ...messages,
        { id: Date.now(), text: 'Your message limit has been reached. Please upgrade your subscription to continue.', sender: 'bot' },
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
      if (response.usage_left !== undefined) {
        dispatch({
          type: types.SUBSCRIPTIONS_FETCH_MY,
          payload: {
            ...subscription,
            usage_left: response.usage_left
          }
        });
      }
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
        {subscription?.is_active ? (
          <div className="usage-info">
            <p><strong>Plan:</strong> {subscription.tier_name || 'Unknown'}</p>
            <p><strong>Usage Left:</strong> {subscription.usage_left} messages</p>
          </div>
        ) : (
          <div className="usage-info">No active subscription</div>
        )}
      </div>

      {!subscription?.is_active ? (
        <div className="subscription-prompt">
          <p>You need an active subscription to use the chatbot.</p>
          <button onClick={() => navigate('/subscription')} className="btn-subscribe">
            Subscribe Now
          </button>
        </div>
      ) : subscription?.usage_left <= 0 ? (
        <div className="subscription-prompt">
          <p>Your message limit has been reached for this month.</p>
          <button onClick={() => navigate('/subscription')} className="btn-subscribe">
            Upgrade Your Plan
          </button>
        </div>
      ) : (
        <>
          <div className="messages-container" ref={messagesContainerRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about our services..."
              disabled={isSending}
              className="chat-input"
            />
            <button 
              type="submit" 
              disabled={isSending || !input.trim() || subscription?.usage_left <= 0}
              className="btn-send"
              title={subscription?.usage_left <= 0 ? "No messages left in your plan" : ""}
            >
              {isSending ? '⏳' : '📤'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default ChatBot;
