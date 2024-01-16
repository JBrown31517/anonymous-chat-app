import { FaPaperclip } from 'react-icons/fa6';
import { Input } from '@/components/ui/input';
import { IoIosSend } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { buttonVariants } from '@/components/ui/button';

const ChatBox = ({ socket, connectToRoom, isConnected }) => {
  const [value, setValue] = useState('');
  const [isHover, setIsHover] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      sender: socket.id,
      message: value,
    };
    socket.emit('send_message', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex p-[24px] items-center gap-[24px] self-stretch fixed bottom-0 w-[100%]">
        <FaPaperclip className="attachments-icon" />
        <div className="flex justify-end items-center relative w-[100%]">
          {isConnected ? (
            <button type="submit" className="absolute mr-2 w-10 send-icon">
              <IoIosSend />
            </button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="bg-white absolute mr-2 w-10"
              onClick={connectToRoom}
              onMouseEnter={() => setIsHover(!isHover)}
              onMouseLeave={() => setIsHover(!isHover)}
            >
              <p>Connect To Room</p>
            </Button>
          )}

          <Input
            className="border border-gray-400 rounded-lg p-4 w-full"
            onChange={e => setValue(e.target.value)}
            value={value}
          />
        </div>
      </div>
    </form>
  );
};

export default ChatBox;
