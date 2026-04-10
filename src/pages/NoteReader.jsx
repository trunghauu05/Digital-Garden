import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function NoteReader() {
  const { slug } = useParams();
  const [content, setContent] = useState('Đang tải nội dung...');
  useEffect(() => {
    fetch(`/data/${slug}.md`)
      .then((response) => {
        if (!response.ok) throw new Error("Không tìm thấy bài học!");
        return response.text();
      })
      .then((text) => {
        setContent(text); 
      })
      .catch(() => {
        setContent("### ❌ Ôi hỏng! Không tìm thấy bài viết này.");
      });
  }, [slug]);
 return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <ReactMarkdown
          components={{
            h1: (props) => <h1 className="text-success border-bottom pb-2 mb-3">{props.children}</h1>,
            h2: (props) => <h2 className="text-warning mt-4">{props.children}</h2>,
            p: (props) => <p className="fs-5">{props.children}</p>,
            code: (props) => <code className="bg-dark text-light p-3 rounded d-block my-3">{props.children}</code>
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}