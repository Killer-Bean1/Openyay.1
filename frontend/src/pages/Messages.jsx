import { useEffect, useState } from "react";
import { messageAPI } from "../services/api";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState({ receiver_id: "", content: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const response = await messageAPI.getInbox();
      setMessages(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.receiver_id || !newMessage.content) {
      alert("Please fill in all fields");
      return;
    }

    setSending(true);
    try {
      await messageAPI.send({
        receiver_id: parseInt(newMessage.receiver_id),
        content: newMessage.content,
      });
      setNewMessage({ receiver_id: "", content: "" });
      fetchMessages();
    } catch (err) {
      alert("Failed to send message");
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Messages</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Send Message Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Send Message</h2>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Receiver ID</label>
              <input
                type="number"
                placeholder="Enter user ID"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={newMessage.receiver_id}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, receiver_id: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                placeholder="Write your message here..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 h-32"
                value={newMessage.content}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, content: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Inbox</h2>
          </div>
          {messages.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No messages yet
            </div>
          ) : (
            <div className="divide-y">
              {messages.map((msg) => (
                <div key={msg.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">From User {msg.sender_id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-700">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
