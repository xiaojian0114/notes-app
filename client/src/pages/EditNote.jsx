import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tag, message, Select } from 'antd'; // 引入 Ant Design 组件
import { updateNote, getNote } from '@/api/noteApi'; // 引入更新和获取笔记的 API
import { getCategories } from '@/api/categoryApi'; // 引入获取分类的 API
import { useStore } from '@/store/userStore'; // 引入全局状态管理
import { useNavigate, useParams } from 'react-router-dom'; // 引入 React Router 的导航和参数钩子
import Navbar from '@/components/Navbar1'; // 引入导航组件

const EditNote = () => {
  const navigate = useNavigate(); // 获取导航对象
  const { noteId } = useParams(); // 获取 URL 参数中的笔记 ID
  const { user } = useStore(); // 从全局状态中获取当前用户信息
  const [tags, setTags] = useState([]); // 标签数组
  const [inputTag, setInputTag] = useState(''); // 输入标签的内容
  const [categories, setCategories] = useState([]); // 分类数组
  const [form] = Form.useForm(); // 获取 Ant Design 的 Form useForm 实例
  const [noteData, setNoteData] = useState(null);

  // 获取笔记内容和分类
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noteResponse, categoriesResponse] = await Promise.all([
          getNote(noteId), // 获取笔记
          getCategories(), // 获取分类
        ]);

        const fetchedNoteData = noteResponse.data;
        setNoteData(fetchedNoteData);
        setTags(fetchedNoteData.tags);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('获取数据失败：', error);
        message.error('获取笔记数据失败');
      }
    };

    fetchData();
  }, [noteId]);

  // 设置表单初始值
  useEffect(() => {
    if (noteData) {
      console.log('Setting form values with noteData:', noteData);
      form.setFieldsValue({
        title: noteData.title,
        content: noteData.content,
        categoryId: noteData.categoryId,
      });
    }
  }, [noteData, form]);

  // 提交表单的处理函数
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const noteData = {
        ...values, // 表单内容
        tags, // 标签
        userId: user.id, // 用户 ID
      };
      await updateNote(noteId, noteData); // 调用 API 更新笔记
      message.success('笔记更新成功'); // 显示提示
      navigate('/notes'); // 跳转回列表页
    } catch (error) {
      console.error('Failed to update note:', error);
      message.error('更新笔记失败'); // 显示失败信息
    }
  };

  // 输入标签内容的变化处理
  const handleInputTagChange = (e) => {
    setInputTag(e.target.value);
  };

  // 添加标签的处理
  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  // 移除标签的处理
  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  return (
    <>
      <Navbar /> {/* 渲染导航组件 */}
      <div className="p-4">
        <h1>编辑笔记</h1>
        <Form
          form={form} // 使用受控表单
          onFinish={handleSubmit} // 表单提交时调用 handleSubmit
          layout="vertical" // 垂直布局
          className="max-w-2xl mx-auto"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入笔记标题' }]} // 表单校验规则
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

          {/* 标签编辑 */}
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

          {/* 提交按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              更新笔记
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EditNote;
