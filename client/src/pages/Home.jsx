import {
  Layout,
  Typography,
  Input,
  Card,
  List,
  Tag,
  Row,
  Col,
  Spin,
  Carousel,
  Empty,
  Switch
} from 'antd';
import { SearchOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar1';
import { useStore } from '../store/userStore';
import { useEffect, useState } from 'react';
import { getNotes } from '../api/noteApi';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = (checked) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getNotes(user.id);
      setNotes(response.data);
    } catch (error) {
      console.error('获取笔记失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const recentNotes = [...filteredNotes]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 8);

  const carouselSettings = {
    autoplay: true,
    dots: true,
    effect: 'fade',
    autoplaySpeed: 4000,
    arrows: true,
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setIsSearching(true);

    if (!value.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    const results = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(value.toLowerCase()) ||
        note.content.toLowerCase().includes(value.toLowerCase()),
    );
    setSearchResults(results);
  };

  return (
    <>
      <Navbar />
      <div className={`p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full max-w-md mx-auto mb-8">
            <Input.Search
              placeholder="探索你的笔记世界..."
              className={`rounded-full shadow-lg hover:shadow-xl transition-shadow ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
              }`}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <SearchOutlined className="text-gray-400 animate-pulse" />
            </div>
          </div>

          {isSearching ? (
            searchResults.length > 0 ? (
              <List
                grid={{ gutter: 24, column: 3 }}
                dataSource={searchResults}
                renderItem={(note) => (
                  <div key={note.id} className="mb-6">
                    <Card
                      hoverable
                      className="note-card shadow-md transition-all duration-300 hover:shadow-lg bg-white"
                      onClick={() => navigate(`/notes/${note.id}`)}
                    >
                      <Card.Meta
                        title={
                          <div className="text-lg font-semibold text-gray-800 mb-3">
                            {note.title}
                          </div>
                        }
                        description={
                          <div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {note.content.length > 150
                                ? `${note.content.substring(0, 150)}...`
                                : note.content}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {note.tags?.map((tag) => (
                                <Tag color="blue" key={tag} className="px-3 py-1">
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </div>
                )}
              />
            ) : (
              <Empty description="没有找到相关笔记" />
            )
          ) : (
            <>
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">最新笔记</h2>
                <Carousel className="note-carousel bg-white rounded-lg shadow-md" {...carouselSettings}>
                  {recentNotes.map((note) => (
                    <div key={note.id} className="px-4 pb-8">
                      <Card
                        hoverable
                        className="note-card h-64"
                        onClick={() => navigate(`/notes/${note.id}`)}
                      >
                        <Card.Meta
                          title={
                            <div className="text-xl font-bold mb-4">
                              {note.title}
                            </div>
                          }
                          description={
                            <div>
                              <p className="text-gray-600 mb-4 text-base line-clamp-3">
                                {note.content.length > 120
                                  ? `${note.content.substring(0, 120)}...`
                                  : note.content}
                              </p>
                              <div className="mt-4">
                                {note.tags?.map((tag) => (
                                  <span key={tag} className="tag">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </div>
                  ))}
                </Carousel>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">所有笔记</h2>
                <List
                  grid={{ gutter: 24, column: 3 }}
                  dataSource={notes}
                  renderItem={(note) => (
                    <div key={note.id} className="px-4 pb-8">
                      <Card
                        hoverable
                        className={`note-card transform transition-all duration-300 hover:scale-105 hover:rotate-1 ${
                          isDarkMode 
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
                            : 'bg-gradient-to-br from-white to-gray-50'
                        }`}
                        onClick={() => navigate(`/notes/${note.id}`)}
                      >
                        <Card.Meta
                          title={
                            <div className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {note.title}
                            </div>
                          }
                          description={
                            <div>
                              <p className={`mb-4 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {note.content}
                              </p>
                              <div className="mt-4">
                                {note.tags?.map((tag) => (
                                  <Tag color="cyan" key={tag}>
                                    {tag}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </div>
                  )}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
