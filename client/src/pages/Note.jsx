import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, message } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { getNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar1 from '@/components/Navbar1';

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        console.log(fetchedNote);
        setNote(fetchedNote.data);
      } catch (error) {
        console.error('Failed to fetch note details:', error);
        alert('获取笔记详情失败');
        navigate('/notes');
      }
    };

    fetchNoteDetails();
  }, [id, navigate]);

  const handleShare = async () => {
    try {
      // 使用Web Share API实现分享功能
      if (navigator.share) {
        await navigator.share({
          title: note.title,
          text: note.content,
          url: window.location.href
        });
        message.success('分享成功！');
      } else {
        // 如果浏览器不支持Web Share API，则复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        message.success('链接已复制到剪贴板！');
      }
    } catch (error) {
      message.error('分享失败，请重试');
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <>
      <Navbar1 />
      <Card className="note-card" hoverable>
        <Card.Meta title={note.title} description={note.content} />
        <div className="my-4">
          {note.tags.map((tag) => (
            <Tag color="cyan" key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
        <div className="flex justify-start mt-4">
          <Button 
            type="primary" 
            icon={<ShareAltOutlined />}
            onClick={handleShare}
          >
            分享
          </Button>
        </div>
      </Card>
    </>
  );
};

export default Note;
