import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tag, message, Select } from 'antd';
import { createNote } from '@/api/noteApi';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar1';

// 创建笔记页面组件
const CreateNote = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        message.error('获取分类失败');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const noteData = {
        ...values,
        tags,
        userId: user.id,
      };
      await createNote(noteData);
      message.success('笔记创建成功');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to create note:', error);
      message.error('创建笔记失败');
    }
  };

  const handleInputTagChange = (e) => {
    setInputTag(e.target.value);
  };

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>创建笔记</h1>
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          className="max-w-2xl mx-auto"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input placeholder="请输入笔记标题" />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入笔记内容' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入笔记内容" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="categoryId"
            rules={[{ required: true, message: '请选择笔记类型' }]}
          >
            <Select placeholder="请选择笔记类型">
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="mb-4">
            <label className="block mb-2">标签</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={inputTag}
                onChange={handleInputTagChange}
                placeholder="输入标签"
                onPressEnter={handleAddTag}
              />
              <Button onClick={handleAddTag}>添加标签</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              创建笔记
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateNote;
