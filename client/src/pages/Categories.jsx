import React, { useState, useEffect } from 'react';
import { List, Card, Row, Col } from 'antd';
import { Pie } from '@ant-design/charts';
import { getCategories } from '@/api/categoryApi';
import { getNotesByCategory } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar1';

const Categories = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.data);

        // 获取每个分类的笔记数量
        const statsPromises = categoriesRes.data.map(async (category) => {
          const notes = await getNotesByCategory(user.id, category.id);
          return {
            type: category.name,
            value: notes.data.length,
          };
        });

        const stats = await Promise.all(statsPromises);
        setCategoryStats(stats);
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };
    fetchData();
  }, [user.id]);

  const totalNotes = categoryStats.reduce(
    (sum, stat) => sum + (stat?.value || 0),
    0,
  );

  const pieConfig = {
    appendPadding: 10,
    data: categoryStats.filter(
      (stat) => stat && stat.type && stat.value !== undefined,
    ),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      offset: '-50%',
      content: (item) => item.type, // 只显示分类名称
      style: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
      },
    },
    tooltip: false, // 移除悬停提示
    legend: {
      position: 'bottom',
    },
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <Row gutter={24}>
          <Col span={16}>
            <h1 className="text-2xl font-bold mb-6">分类列表</h1>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={categories}
              renderItem={(item) => (
                <Card
                  hoverable
                  className="m-2 shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/notes/categories/${item.id}`)}
                >
                  <Card.Meta
                    title={item.name}
                    description={`包含 ${categoryStats.find((stat) => stat.type === item.name)?.value || 0} 篇笔记`}
                  />
                  <a className="mt-4 block text-blue-500 hover:text-blue-700">
                    查看分类笔记
                  </a>
                </Card>
              )}
            />
          </Col>
          <Col span={8}>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">分类笔记占比</h2>
              {categoryStats && categoryStats.length > 0 && (
                <Pie {...pieConfig} />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Categories;
