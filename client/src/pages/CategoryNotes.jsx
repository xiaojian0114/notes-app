import React, { useState, useEffect } from 'react';
import { List, Card, Tag } from 'antd';
import { getNotesByCategory } from '@/api/noteApi';
import { useStore } from '../store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar1';

const CategoryNotes = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchNotesByCategory = async () => {
      try {
        const fetchedNotes = await getNotesByCategory(user.id, categoryId);
        setNotes(fetchedNotes.data);
      } catch (error) {
        console.error('Fetch notes failed:', error);
        alert('获取笔记失败');
      }
    };
    fetchNotesByCategory();
  }, [categoryId]);

  if (!notes) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">分类笔记列表</h1>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={notes}
          renderItem={(item) => (
            <Card
              className="bg-blue-100 m-2 hover:shadow-lg transition-shadow"
              hoverable
            >
              <Card.Meta
                title={
                  <div className="text-xl font-bold mb-3">{item.title}</div>
                }
                description={
                  <div className="text-gray-600">
                    {item.content.substring(0, 60) + '...'}
                  </div>
                }
              />
              {item.tags && item.tags.length > 0 && (
                <div className="mt-4 mb-3">
                  {item.tags.map((tag) => (
                    <Tag color="cyan" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <a
                  href={`/notes/${item.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  查看详情
                </a>
              </div>
            </Card>
          )}
        />
      </div>
    </>
  );
};

export default CategoryNotes;
