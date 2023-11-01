import * as React from "react";

interface User {
  id: number;
  name: string;
}

interface Mention {
  start: number;
  end: number;
  user: User;
}

interface Props {
  users: User[];
}

export const Mention: React.FC<Props> = ({ users }) => {
  const [comment, setComment] = React.useState("");
  const [userList, setUserList] = React.useState<User[]>([]);
  const [mentions, setMentions] = React.useState<Mention[]>([]);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const comment = event.target.value;
    setComment(comment);
    if (comment.endsWith("@")) {
      setUserList(users);
    } else {
      setUserList([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "@") {
      setUserList(users);
    }
  };

  const handleUserClick = (user: User) => {
    const start = comment.lastIndexOf("@");
    const end = comment.length;
    const mention: Mention = { start, end, user };
    const newMentions = [...mentions, mention];
    const newComment =
      comment.substring(0, start) + `@${user.name} ` + comment.substring(end);
    setComment(newComment);
    setMentions(newMentions);
    setUserList([]);
    inputRef.current?.focus();
  };

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mentionedUsers = mentions.map((mention) => mention.user);
    // Guardar el comentario y notificar a los usuarios mencionados
  };

  const renderComment = () => {
    let startIndex = 0;
    const parts = [];
    for (const mention of mentions) {
      const { start, end, user } = mention;
      parts.push(comment.substring(startIndex, start));
      parts.push(
        <span className="relative">
          <a href="#" key={start} className="mention">
            @{user.name}
          </a>
        </span>,
      );
      startIndex = end;
    }
    parts.push(comment.substring(startIndex));
    return parts;
  };

  return (
    <div className="p-4">
      <form onSubmit={handleCommentSubmit}>
        <textarea
          className="w-full p-2 border rounded mention-textarea"
          value={comment}
          onChange={handleCommentChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        {userList.length > 0 && (
          <ul className="mt-2 border rounded top-0 left-0">
            {userList.map((user) => (
              <li
                key={user.id}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleUserClick(user)}
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          type="submit"
        >
          Enviar
        </button>
      </form>
      <div className="mt-4 mention-comment">
        {renderComment().map((part, index) => (
          <React.Fragment key={index}>{part}</React.Fragment>
        ))}
      </div>
    </div>
  );
};
