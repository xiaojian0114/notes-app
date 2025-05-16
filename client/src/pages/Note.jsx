import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, message } from 'antd';
import { ShareAltOutlined, DownloadOutlined } from '@ant-design/icons';
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

  const handleExport = () => {
    try {
      // 创建要导出的笔记数据
      const exportData = {
        title: note.title,
        content: note.content,
        tags: note.tags,
        categoryId: note.categoryId
      };

      // 转换为JSON字符串
      const jsonStr = JSON.stringify(exportData, null, 2);

      // 创建Blob对象
      const blob = new Blob([jsonStr], { type: 'application/json' });

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title}.json`;
      
      // 触发下载
      document.body.appendChild(a);
      a.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success('笔记导出成功！');
    } catch (error) {
      console.error('导出笔记失败:', error);
      message.error('导出笔记失败，请重试');
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <>
      <Navbar1 />
      <div className="max-w-4xl mx-auto p-8">
        <Card 
          className="note-card shadow-lg rounded-lg" 
          hoverable
        >
          <Card.Meta 
            title={<h1 className="text-2xl font-bold mb-4">{note.title}</h1>}
            description={
              <div className="text-gray-700 whitespace-pre-wrap">
                {note.content}
              </div>
            } 
          />
          <div className="my-6">
            {note.tags.map((tag) => (
              <Tag color="blue" key={tag} className="mr-2 px-3 py-1">
                {tag}
              </Tag>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <Button 
              type="primary" 
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            >
              分享
            </Button>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              导出笔记
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Note;
