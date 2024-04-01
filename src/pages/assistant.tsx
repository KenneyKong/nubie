import { OpenAI } from 'openai';
import { FC, useEffect, useState, useRef } from 'react';

interface Props {
  assistantId: string;
  apiKey: string;
}

const Assistant: FC<Props> = ({ assistantId, apiKey }) => {
  const [query, setQuery] = useState<string>('');
  const [messageList, setMessageList] = useState<ThreadMessage[]>([]);
  const [waiting, setWaiting] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
  const [thread, setThread] = useState<null | Threads.Thread>(null);

  useEffect(() => {
    const createThread = async () => {
      setThread(await openai.beta.threads.create());
    };
    if (!thread) createThread();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const updateMessages = async (intervalId: NodeJS.Timeout) => {
    clearInterval(intervalId);
    if (!thread) return;
    const messages = await openai.beta.threads.messages.list(thread.id);
    setMessageList(messages.data.reverse());
    setWaiting(false);
  };

  const handleQuery = async () => {
    if (!thread) return;
    setQuery("");
    setWaiting(true);
    const _message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: query
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    try {
      const intervalId = setInterval(async () => {
        const res = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        if (res.status === "completed") {
          updateMessages(intervalId);
        }
      }, 3000);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col h-80 overflow-y-auto">
        {messageList.map((message, index) => (
          <div key={index} className={`ml-3 my-2 ${index === messageList.length - 1 ? 'font-semibold' : ''}`}>
            {message.content.length === 0 ? "No Content" : (
              <p className="text-left">{message.content[0].type === "text" && message.content[0].text.value}</p>
            )}
          </div>
        ))}
        {waiting && (
          <div className="flex justify-center items-center mt-2">
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center" disabled>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4c-1.88 0-3.617-.646-5-1.709l1.416-1.416zM20 12a8 8 0 01-8 8v4c4.418 0 8-3.582 8-8h-4zm-2-5.291A7.962 7.962 0 0120 12h4c0-4.418-3.582-8-8-8v4c1.88 0 3.617.646 5 1.709l-1.416 1.416z"></path>
              </svg>
              Processing...
            </button>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleQuery() }} className="flex flex-col text-center w-full mb-6 max-w-4xl">
        <div className="mt-4 flex flex-row items-center">
          <input
            style={{ flex: 1 }}
            onChange={handleQueryChange}
            value={query}
            id="query"
            placeholder="Enter Question here"
            className="p-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="px-4 py-2 ml-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600">Search</button>
        </div>
      </form>
    </div>
  );
};

export default Assistant;
