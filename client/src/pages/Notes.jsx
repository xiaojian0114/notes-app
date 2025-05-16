import { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Modal, message, Upload, DatePicker, Select } from 'antd';
import { getNotes, deleteNote, createNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar1';
import { InboxOutlined, BellOutlined } from '@ant-design/icons';

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem('reminders');
    return savedReminders ? JSON.parse(savedReminders) : [];
  });
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newReminder, setNewReminder] = useState({
    title: '',
    datetime: null,
    type: 'once',
    description: '',
    noteId: null
  });

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

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.datetime);
        if (!reminder.notified && reminderTime <= now) {
          message.info(`提醒：${reminder.title} - ${reminder.description}`);
          setReminders(prev =>
            prev.map(r =>
              r.datetime === reminder.datetime ? { ...r, notified: true } : r
            )
          );
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

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

  const handleAddReminder = () => {
    if (!newReminder.datetime) {
      message.error('请选择提醒时间');
      return;
    }

    const reminderData = {
      ...newReminder,
      title: selectedNote.title,
      description: `笔记提醒: ${selectedNote.title}`,
      noteId: selectedNote.id,
      notified: false
    };

    setReminders(prev => [...prev, reminderData]);
    setReminderModalVisible(false);
    setSelectedNote(null);
    setNewReminder({
      title: '',
      datetime: null,
      type: 'once',
      description: '',
      noteId: null
    });
    message.success('提醒设置成功');
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
                icon={<BellOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNote(item);
                  setReminderModalVisible(true);
                }}
              >
                提醒
              </Button>
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
      <Modal
        title="添加笔记提醒"
        open={reminderModalVisible}
        onOk={handleAddReminder}
        onCancel={() => {
          setReminderModalVisible(false);
          setSelectedNote(null);
        }}
      >
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="mb-2">笔记标题</h4>
            <p>{selectedNote?.title}</p>
          </div>
          <div className="mb-4">
            <h4 className="mb-2">提醒类型</h4>
            <Select
              style={{ width: '100%' }}
              value={newReminder.type}
              onChange={(value) => setNewReminder(prev => ({ ...prev, type: value }))}
              options={[
                { value: 'once', label: '一次性提醒' },
                { value: 'daily', label: '每日提醒' },
                { value: 'weekly', label: '每周提醒' },
                { value: 'monthly', label: '每月提醒' }
              ]}
            />
          </div>
          <div className="mb-4">
            <h4 className="mb-2">提醒时间</h4>
            <DatePicker
              showTime
              style={{ width: '100%' }}
              placeholder="选择提醒时间"
              onChange={value => setNewReminder(prev => ({ ...prev, datetime: value?.valueOf() }))}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Notes;
