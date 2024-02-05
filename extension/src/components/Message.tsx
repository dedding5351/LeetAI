import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Updated import
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import scala from 'react-syntax-highlighter/dist/esm/languages/prism/scala';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';

// Register language support
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('python3', python);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('scala', scala);
SyntaxHighlighter.registerLanguage('sql', sql);
// Register additional languages

export type MessageType = { id: string; text: string; isUser: boolean; timestamp: number };

type MessageProps = {
  message: MessageType;
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const formatMessageText = (text: string) => {
    // Replace escaped newline sequences with actual newline characters
    const cleanedText = text.replace(/\\\\n/g, '\\n').replace(/\\n/g, '\n').replace(/\\\"/g, '"');

    return cleanedText;
  };

  const extractLanguage = (codeBlock: string): [string, string] => {
    const lines = codeBlock.split(/\\n|\n/);
    const firstLine = lines[0].trim();
    const codeBlockRemainder = lines.slice(1).join('\n').trim();
  
    return [firstLine || 'plaintext', codeBlockRemainder];
  };

  const renderMessageContent = () => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = message.text.split(codeBlockRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const [language, codeBlockRemainder] = extractLanguage(part);

        return (
          <div key={index} style={{ margin: '8px 0' }}>
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{ background: 'black', padding: '10px', borderRadius: '5px' }}
            >
              {formatMessageText(codeBlockRemainder)}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        return <span key={index} dangerouslySetInnerHTML={{ __html: formatMessageText(part) }} />;
      }
    });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`${message.isUser ? 'bg-blue-500' : 'bg-gray-500'} p-2 rounded-lg text-white`}
        style={{
        }}
      >
        {renderMessageContent()}
      </div>
    </div>
  );
};

export default Message;
