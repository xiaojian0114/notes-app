import { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Modal, message, Upload } from 'antd';
import { getNotes, deleteNote, createNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar1';
import { InboxOutlined } from '@ant-design/icons';

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const fetchedNotesData = await getNotes(user.id);
      setNotes(fetchedNotesData.data);
    } catch (error) {
      console.error('Fetch notes failed:', error);
      alert('获取笔记失败');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        const noteData = JSON.parse(content);
        
        // 确保导入的数据包含必要字段
        if (!noteData.title || !noteData.content) {
          message.error('导入的文件格式不正确');
          return;
        }

        // 准备笔记数据
        const newNote = {
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags || [],
          categoryId: noteData.categoryId || 1, // 默认分类
          userId: user.id
        };

        // 调用创建笔记API
        await createNote(newNote);
        message.success('笔记导入成功');
        fetchNotes(); // 刷新笔记列表
      } catch (error) {
        console.error('导入笔记失败:', error);
        message.error('导入笔记失败');
      }
    };
    reader.readAsText(file);
    return false; // 阻止自动上传
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center p-6">
        <h1>笔记详情</h1>
        <div className="flex gap-2">
          <Upload
            accept=".json"
            showUploadList={false}
            beforeUpload={handleImport}
          >
            <Button type="primary">导入笔记</Button>
          </Upload>
          <Button type="primary" onClick={() => navigate('/create-note')}>
            创建笔记
          </Button>
        </div>
      </div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={notes}
        className="p-4"
        renderItem={(item) => (
          <Card className="bg-blue-100 m-2" hoverable>
            <Card.Meta
              title={item.title}
              description={item.content.substring(0, 100) + '...'}
            />
            <div className="my-4">
              {item.tags.map((tag) => (
                <Tag color="cyan" key={tag}>
                  {tag}
                </Tag>
              ))}
            </div>
            <a href={`/notes/${item.id}`}>点击查看详情</a>
            <div className="mt-4 flex gap-2">
              <Button
                type="primary"
                onClick={() => navigate(`/notes/edit/${item.id}`)}
              >
                编辑
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedNoteId(item.id);
                }}
              >
                删除
              </Button>
            </div>
          </Card>
        )}
      />

      <Modal
        title="确认删除"
        open={modalVisible}
        onOk={async () => {
          setLoading(true);
          try {
            await deleteNote(selectedNoteId);
            message.success('删除成功');
            fetchNotes();
          } catch (error) {
            message.error('删除失败');
          } finally {
            setLoading(false);
            setModalVisible(false);
            setSelectedNoteId(null);
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setSelectedNoteId(null);
        }}
        confirmLoading={loading}
      >
        <p>确定要删除这条笔记吗？此操作不可恢复</p>
      </Modal>
    </>
  );
};

export default Notes;
