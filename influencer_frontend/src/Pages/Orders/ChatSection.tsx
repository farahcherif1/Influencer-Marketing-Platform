import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, TextField, Typography, useTheme } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;
}
export default function ChatSection({
  currentUserId,
  otherUserId,
  //   otherUserName,
  revisionMessage,
}: {
  currentUserId: number;
  otherUserId: number;
  otherUserName: string;
  revisionMessage: string | null;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { t, i18n } = useTranslation('Orders');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  useEffect(() => {
    if (revisionMessage && socket) {
      const messageData = {
        senderId: currentUserId,
        receiverId: otherUserId,
        content: `${revisionMessage}`,
      };
      socket.emit('createMessage', messageData);
    }
  }, [revisionMessage, socket]);

  useEffect(() => {
    const socketInstance = io('ws://localhost:3000');
    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('join', currentUserId);
    });
    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });
    socketInstance.on('receiveMessage', (message: Message) => {
      if (
        (message.senderId === currentUserId && message.receiverId === otherUserId) ||
        (message.senderId === otherUserId && message.receiverId === currentUserId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });
    setSocket(socketInstance);
    loadChatHistory();
    return () => {
      socketInstance.disconnect();
    };
  }, [currentUserId, otherUserId]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get(`/messages/${currentUserId}/${otherUserId}`);
      if (response.status === 200) {
        const chatHistory = response.data as Message[];
        setMessages(chatHistory);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !isConnected) return;
    const messageData = {
      senderId: currentUserId,
      receiverId: otherUserId,
      content: newMessage.trim(),
    };
    socket.emit('createMessage', messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        direction: direction,
      }}
    >
      <Box>
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'grey.500',
            }}
          >
            <Typography variant="body2"> {t('chatSection.noMessages')}</Typography>
          </Box>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUserId;

            return (
              <Box
                key={message.id || index}
                sx={{
                  display: 'flex',
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor: isOwnMessage ? theme.palette.info.main : 'grey.100',
                    color: isOwnMessage ? 'white' : 'text.primary',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    borderBottomRightRadius: isOwnMessage ? 0.5 : 2,
                    borderBottomLeftRadius: isOwnMessage ? 2 : 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.7rem',
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 1.5,
          borderTop: 1,
          borderColor: 'grey.200',
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end',
          bgcolor: 'white',
        }}
      >
        <TextField
          multiline
          maxRows={3}
          placeholder={t('chatSection.placeholder')}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
          disabled={!isConnected}
        />
        <IconButton
          onClick={sendMessage}
          disabled={!newMessage.trim() || !isConnected}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'grey.300',
              color: 'grey.500',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
