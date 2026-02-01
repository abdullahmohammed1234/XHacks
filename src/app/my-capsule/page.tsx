'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NostalgiaBackground } from '@/components/features/nostalgia-background';
import { PersonalizedWrapped } from '@/components/features/personalized-wrapped';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { years, categories } from '@/data/seed';
import { PersonalCapsuleEntry } from '@/types';
import { cn } from '@/lib/utils';
import { X, Globe, Lock, Users, Edit2, Trash2, Plus, Image, Save, ArrowLeft } from 'lucide-react';

// Extended capsule type with additional properties for the UI
interface ExtendedCapsule {
  id: string;
  userId: string;
  yearId: string;
  year: number;
  title: string;
  description?: string;
  coverImage?: string;
  status: 'open' | 'sealed' | 'unlocked';
  visibility: 'public' | 'friends' | 'private';
  shareCode?: string;
  isFavorite?: boolean;
  unlockDate?: string;
  sealedAt?: string;
  submissions: PersonalCapsuleEntry[];
  createdAt: string;
  updatedAt: string;
}

// Get current year for date constraints
const CURRENT_YEAR = new Date().getFullYear();
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Helper to get days in a month
const getDaysInMonth = (month: string, year: number): number => {
  const monthIndex = MONTHS.indexOf(month);
  return new Date(year, monthIndex + 1, 0).getDate();
};

// Mock data for demo
const mockUser = {
  id: 'user-1',
  username: 'demo_user',
  displayName: 'Demo User',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  bio: 'Lover of internet culture',
  createdAt: '2024-01-01',
  followers: 42,
  following: 38,
  capsulesCount: 3,
  isPrivate: false
};

const mockCapsules: ExtendedCapsule[] = [
  {
    id: 'capsule-2026',
    userId: 'user-1',
    yearId: '2026',
    year: 2026,
    title: 'My 2026 Time Capsule',
    description: 'Building my capsule for this year',
    status: 'open',
    visibility: 'public',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-15',
    submissions: [
      {
        id: 'sub-2026-1',
        userId: 'user-1',
        yearId: '2026',
        categoryId: 'trends',
        title: 'Viral Dance Challenge',
        description: 'Participated in the biggest dance challenge of the year!',
        mediaType: 'text',
        createdAt: '2026-02-14',
        isPublic: true
      }
    ]
  },
  {
    id: 'capsule-2024',
    userId: 'user-1',
    yearId: '2024',
    year: 2024,
    title: 'My 2024 Rewind',
    description: 'A year of new beginnings and memorable moments',
    status: 'open',
    visibility: 'public',
    createdAt: '2024-01-01',
    updatedAt: '2024-12-01',
    submissions: [
      {
        id: 'sub-1',
        userId: 'user-1',
        yearId: '2024',
        categoryId: 'style',
        title: 'Summer Vacation Photo',
        description: 'Beach day during summer break!',
        mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        mediaType: 'image',
        createdAt: '2024-07-15',
        isPublic: true
      },
      {
        id: 'sub-2',
        userId: 'user-1',
        yearId: '2024',
        categoryId: 'music',
        title: 'Favorite Song of the Year',
        description: 'Espresso by Sabrina Carpenter - this song defined my summer!',
        mediaType: 'text',
        createdAt: '2024-08-20',
        isPublic: true
      },
      {
        id: 'sub-3',
        userId: 'user-1',
        yearId: '2024',
        categoryId: 'trends',
        title: 'Cool article I found',
        description: 'Check out this amazing article about digital culture',
        mediaUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
        mediaType: 'text',
        createdAt: '2024-09-10',
        isPublic: true
      },
      {
        id: 'sub-4',
        userId: 'user-1',
        yearId: '2024',
        categoryId: 'tv',
        title: 'Concert Footage',
        description: 'Amazing night at the concert!',
        mediaUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        mediaType: 'video',
        createdAt: '2024-10-05',
        isPublic: true
      }
    ],
    shareCode: 'CAP-2024-XYZ',
    isFavorite: true,
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
  },
  {
    id: 'capsule-2023',
    userId: 'user-1',
    yearId: '2023',
    year: 2023,
    title: 'My 2023 Time Capsule',
    description: 'The year of Barbenheimer and new experiences',
    status: 'sealed',
    visibility: 'friends',
    createdAt: '2023-01-01',
    updatedAt: '2023-12-31',
    sealedAt: '2023-12-31',
    unlockDate: '2028-12-31',
    submissions: [
      {
        id: 'sub-3',
        userId: 'user-1',
        yearId: '2023',
        categoryId: 'tv',
        title: 'Barbie Movie Night',
        description: 'Saw the Barbie movie with friends!',
        mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
        mediaType: 'image',
        createdAt: '2023-07-21',
        isPublic: true
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800'
  }
];

// Mock friends data
const mockFriends = [
  { id: 'friend-1', username: 'nostalgia_queen', displayName: 'Nostalgia Queen', avatarUrl: '', capsulesCount: 5 },
  { id: 'friend-2', username: 'meme_lord', displayName: 'Meme Lord', avatarUrl: '', capsulesCount: 3 },
  { id: 'friend-3', username: 'retro_fan', displayName: 'Retro Fan', avatarUrl: '', capsulesCount: 7 },
];

// Mock gallery items
const mockGalleryItems = [
  { id: 'gal-1', type: 'image' as const, title: 'Beach Day', preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200', likes: 15, date: '2024-06-15' },
  { id: 'gal-2', type: 'text' as const, title: 'Reflecting on 2024', preview: 'This year has been...', likes: 8, date: '2024-12-20' },
  { id: 'gal-3', type: 'video' as const, title: 'Concert Night', preview: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200', likes: 22, date: '2024-08-10' },
];

export default function MyCapsulePage() {
  const [capsules, setCapsules] = useState<ExtendedCapsule[]>(mockCapsules);
  const [selectedCapsule, setSelectedCapsule] = useState<ExtendedCapsule | null>(null);
  const [viewingCapsule, setViewingCapsule] = useState<ExtendedCapsule | null>(null);
  const [showSealModal, setShowSealModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'capsules' | 'gallery' | 'friends' | 'wrapped'>('capsules');
  const [sealWarning, setSealWarning] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    coverImage: '',
    visibility: 'public' as 'public' | 'friends' | 'private'
  });

  const [createForm, setCreateForm] = useState({
    year: 2026,
    title: '',
    description: '',
    visibility: 'public' as 'public' | 'friends' | 'private'
  });

  const [submissionForm, setSubmissionForm] = useState({
    type: 'text' as 'image' | 'video' | 'text' | 'link',
    title: '',
    description: '',
    mediaUrl: '',
    categoryId: 'other',
    month: MONTHS[new Date().getMonth()],
    day: Math.min(new Date().getDate(), 28)
  });

  const [sealDate, setSealDate] = useState<string>('2027-01-01');

  const getStatusBadge = (status: ExtendedCapsule['status']) => {
    const styles: Record<string, string> = {
      open: 'bg-green-500',
      sealed: 'bg-red-500',
      unlocked: 'bg-blue-500'
    };
    return (
      <Badge className={cn(styles[status], 'text-white font-medium')}>
        {status === 'open' ? '🔓 Open' : status === 'sealed' ? '🔒 Sealed' : '✨ Unlocked'}
      </Badge>
    );
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'friends':
        return <Users className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getMediaIcon = (type: string | undefined) => {
    switch (type) {
      case 'image':
        return '📷';
      case 'video':
        return '🎬';
      default:
        return '📝';
    }
  };

  const handleOpenEditModal = (capsule: ExtendedCapsule) => {
    setSelectedCapsule(capsule);
    setEditForm({
      title: capsule.title,
      description: capsule.description || '',
      coverImage: capsule.coverImage || '',
      visibility: capsule.visibility
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedCapsule) return;
    
    setCapsules(prev => prev.map(c => 
      c.id === selectedCapsule.id 
        ? { 
            ...c, 
            title: editForm.title,
            description: editForm.description,
            coverImage: editForm.coverImage,
            visibility: editForm.visibility,
            updatedAt: new Date().toISOString()
          }
        : c
    ));
    setShowEditModal(false);
  };

  const handleCreateCapsule = () => {
    const newCapsule: ExtendedCapsule = {
      id: `capsule-${Date.now()}`,
      userId: 'user-1',
      yearId: createForm.year.toString(),
      year: createForm.year,
      title: createForm.title || `My ${createForm.year} Time Capsule`,
      description: createForm.description || 'Building my capsule...',
      status: 'open',
      visibility: createForm.visibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissions: []
    };
    setCapsules([newCapsule, ...capsules]);
    setShowCreateModal(false);
    setCreateForm({ year: CURRENT_YEAR, title: '', description: '', visibility: 'public' });
  };

  const handleSealCapsule = () => {
    if (!selectedCapsule) return;
    
    if (!sealWarning) {
      setSealWarning(true);
      return;
    }
    
    setCapsules(prev => prev.map(c => 
      c.id === selectedCapsule.id 
        ? { 
            ...c, 
            status: 'sealed' as const, 
            sealedAt: new Date().toISOString(),
            unlockDate: sealDate
          }
        : c
    ));
    setShowSealModal(false);
    setSealWarning(false);
  };

  const handleAddSubmission = () => {
    if (!selectedCapsule) return;
    
    // Build date string from month and day
    const monthIndex = MONTHS.indexOf(submissionForm.month);
    const dateStr = `${selectedCapsule.year}-${String(monthIndex + 1).padStart(2, '0')}-${String(submissionForm.day).padStart(2, '0')}`;
    
    const newSubmission: PersonalCapsuleEntry = {
      id: `sub-${Date.now()}`,
      userId: 'user-1',
      yearId: selectedCapsule.yearId,
      categoryId: submissionForm.categoryId,
      title: submissionForm.title || `New ${submissionForm.type}`,
      description: submissionForm.description,
      mediaUrl: submissionForm.mediaUrl,
      mediaType: submissionForm.type === 'link' ? 'text' : submissionForm.type as 'image' | 'video' | 'text',
      createdAt: dateStr,
      isPublic: true
    };
    
    setCapsules(prev => prev.map(c => 
      c.id === selectedCapsule.id 
        ? { ...c, submissions: [...c.submissions, newSubmission], updatedAt: new Date().toISOString() }
        : c
    ));
    setShowSubmitModal(false);
    setSubmissionForm({
      type: 'text',
      title: '',
      description: '',
      mediaUrl: '',
      categoryId: 'other',
      month: MONTHS[new Date().getMonth()],
      day: Math.min(new Date().getDate(), 28)
    });
  };

  const handleDeleteCapsule = (capsuleId: string) => {
    setCapsules(prev => prev.filter(c => c.id !== capsuleId));
    if (selectedCapsule?.id === capsuleId) {
      setSelectedCapsule(null);
    }
  };

  // Get available seal dates based on current date
  const getSealDateOptions = () => {
    const options: { value: string; label: string }[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Start from next month
    const startMonth = now.getMonth() + 1;
    
    for (let year = currentYear; year <= currentYear + 10; year++) {
      const startM = year === currentYear ? startMonth : 0;
      for (let month = startM; month < 12; month++) {
        const monthName = MONTHS[month];
        const lastDay = new Date(year, month + 1, 0).getDate();
        const day = Math.min(28, lastDay);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        options.push({ value: dateStr, label: `${monthName} ${day}, ${year}` });
      }
    }
    return options.slice(0, 50);
  };

  // Handle capsule click to view details
  const handleCapsuleClick = (capsule: ExtendedCapsule) => {
    if (capsule.status === 'sealed' && capsule.unlockDate && new Date(capsule.unlockDate) > new Date()) {
      return;
    }
    setViewingCapsule(capsule);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back button when viewing capsule */}
          {viewingCapsule && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                onClick={() => setViewingCapsule(null)}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Capsules
              </Button>
            </motion.div>
          )}

          {/* Header - Hide when viewing capsule */}
          {!viewingCapsule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    📦
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    MyCapsule
                  </h1>
                  <p className="text-xl text-gray-300">
                    Create and manage your personal time capsules
                  </p>
                </div>
                
                {/* User Profile Summary */}
                <Card className="shrink-0 bg-white/10 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={mockUser.avatarUrl} 
                        alt={mockUser.displayName}
                        className="w-16 h-16 rounded-full bg-purple-500/30"
                      />
                      <div>
                        <p className="font-bold text-white">{mockUser.displayName}</p>
                        <p className="text-sm text-gray-300">@{mockUser.username}</p>
                        <div className="flex gap-4 text-sm mt-1 text-gray-300">
                          <span>📦 {capsules.length}</span>
                          <span>👥 {mockUser.followers}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Viewing Capsule Detail - MyBlueprint Style */}
          {viewingCapsule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                {/* Capsule Header */}
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  {viewingCapsule.coverImage ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${viewingCapsule.coverImage})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-white/20 text-white border-0">{viewingCapsule.year}</Badge>
                      {getStatusBadge(viewingCapsule.status)}
                      <span className="text-gray-300 flex items-center gap-1">
                        {getVisibilityIcon(viewingCapsule.visibility)}
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">{viewingCapsule.title}</h2>
                    <p className="text-gray-300 max-w-2xl">{viewingCapsule.description}</p>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {viewingCapsule.status === 'open' && (
                    <>
                      <Button 
                        onClick={() => {
                          setSelectedCapsule(viewingCapsule);
                          setShowSubmitModal(true);
                          const now = new Date();
                          setSubmissionForm(prev => ({
                            ...prev,
                            month: MONTHS[now.getMonth()],
                            day: Math.min(now.getDate(), 28)
                          }));
                        }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Memory
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedCapsule(viewingCapsule);
                          setShowSealModal(true);
                          setSealWarning(false);
                        }}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        🔒 Seal Capsule
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => handleOpenEditModal(viewingCapsule)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>

                {/* Timeline / Entries Grid - MyBlueprint Style */}
                {viewingCapsule.submissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {viewingCapsule.submissions
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((submission, index) => (
                        <motion.div
                          key={submission.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 rounded-xl overflow-hidden hover:bg-white/20 transition-all"
                        >
                          {/* Media Preview */}
                          {(submission.mediaType === 'image' || submission.mediaType === 'video') && submission.mediaUrl && (
                            <div 
                              className="h-48 bg-cover bg-center relative"
                              style={{ backgroundImage: `url(${submission.mediaUrl})` }}
                            >
                              {submission.mediaType === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <span className="text-6xl">🎬</span>
                                </div>
                              )}
                            </div>
                          )}
                          {(!submission.mediaUrl || submission.mediaType === 'text') && (
                            <div className="h-48 bg-gradient-to-br from-purple-600/50 to-pink-600/50 flex items-center justify-center">
                              <span className="text-6xl">{getMediaIcon(submission.mediaType)}</span>
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-400">
                                {new Date(submission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                                {submission.categoryId}
                              </Badge>
                            </div>
                            <h3 className="text-white font-semibold mb-1">{submission.title}</h3>
                            <p className="text-gray-300 text-sm line-clamp-3">{submission.description}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-2xl p-12 text-center">
                    <span className="text-6xl mb-4 block">📭</span>
                    <h3 className="text-2xl font-bold text-white mb-2">No memories yet</h3>
                    <p className="text-gray-400 mb-6">Start adding your memories to this capsule!</p>
                    <Button 
                      onClick={() => {
                        setSelectedCapsule(viewingCapsule);
                        setShowSubmitModal(true);
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Memory
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Main Content - Hide when viewing capsule */}
          {!viewingCapsule && (
            <>
              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-center gap-2 mb-8 flex-wrap">
                  {([
                    { key: 'capsules', icon: '📦', label: 'Capsules' },
                    { key: 'gallery', icon: '🖼️', label: 'Gallery' },
                    { key: 'friends', icon: '👥', label: 'Friends' },
                    { key: 'wrapped', icon: '✨', label: 'Wrapped' }
                  ] as const).map((tab) => (
                    <Button
                      key={tab.key}
                      variant={activeTab === tab.key ? 'default' : 'outline'}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "capitalize px-6 py-3 text-lg transition-all",
                        activeTab === tab.key 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0" 
                          : "border-white/30 text-white hover:bg-white/10"
                      )}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Capsules Tab Content */}
              {activeTab === 'capsules' && (
                <>
                  {/* Create New Capsule Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-center mb-8">
                      <Button 
                        size="lg" 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-xl rounded-full shadow-lg hover:shadow-purple-500/25 transition-all"
                      >
                        <Plus className="w-6 h-6 mr-2" />
                        Create New Capsule
                      </Button>
                    </div>
                  </motion.div>

                  {/* Capsules Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {capsules.map((capsule, index) => (
                      <motion.div
                        key={capsule.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card 
                            className={cn(
                              'h-full cursor-pointer transition-all duration-300 bg-white/10 border-white/20',
                              selectedCapsule?.id === capsule.id && 'ring-2 ring-purple-500'
                            )}
                            onClick={() => handleCapsuleClick(capsule)}
                          >
                            {/* Cover Image or Gradient */}
                            {capsule.coverImage ? (
                              <div 
                                className="h-40 bg-cover bg-center rounded-t-xl"
                                style={{ backgroundImage: `url(${capsule.coverImage})` }}
                              />
                            ) : (
                              <div className="h-40 bg-gradient-to-br from-purple-600 to-pink-600 rounded-t-xl flex items-center justify-center">
                                <span className="text-6xl">📦</span>
                              </div>
                            )}
                            
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="border-white/30 text-white">
                                  {capsule.year}
                                </Badge>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(capsule.status)}
                                  <span className="text-gray-400" title={capsule.visibility}>
                                    {getVisibilityIcon(capsule.visibility)}
                                  </span>
                                </div>
                              </div>
                              <CardTitle className="text-xl text-white">{capsule.title}</CardTitle>
                            </CardHeader>
                            
                            <CardContent>
                              {/* Empty State Message */}
                              {capsule.submissions.length === 0 ? (
                                <div className="bg-purple-500/20 rounded-lg p-4 text-center mb-4">
                                  <p className="text-purple-200 font-medium">
                                    Nothing vaulted yet.
                                  </p>
                                  <p className="text-purple-300 text-sm">
                                    Add your memories of {capsule.year}!
                                  </p>
                                </div>
                              ) : (
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                  {capsule.description}
                                </p>
                              )}
                              
                              {/* Submissions Preview */}
                              {capsule.submissions.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                  {capsule.submissions.slice(0, 3).map((sub) => (
                                    <div 
                                      key={sub.id}
                                      className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center text-lg"
                                    >
                                      {getMediaIcon(sub.mediaType)}
                                    </div>
                                  ))}
                                  {capsule.submissions.length > 3 && (
                                    <div className="w-10 h-10 rounded-full bg-pink-500/30 flex items-center justify-center text-sm font-bold text-white">
                                      +{capsule.submissions.length - 3}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex gap-2 flex-wrap">
                                {capsule.status === 'open' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCapsule(capsule);
                                        const now = new Date();
                                        setSubmissionForm(prev => ({
                                          ...prev,
                                          month: MONTHS[now.getMonth()],
                                          day: Math.min(now.getDate(), 28)
                                        }));
                                        setShowSubmitModal(true);
                                      }}
                                      className="border-white/30 text-white hover:bg-white/10 flex-1 min-w-[80px]"
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCapsule(capsule);
                                        setShowSealModal(true);
                                        setSealWarning(false);
                                      }}
                                      className="bg-red-500 hover:bg-red-600 text-white flex-1 min-w-[80px]"
                                    >
                                      🔒 Seal
                                    </Button>
                                  </>
                                )}
                                {capsule.status === 'sealed' && capsule.shareCode && (
                                  <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 flex-1">
                                    🔗 Share
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(capsule);
                                  }}
                                  className="border-white/30 text-white hover:bg-white/10"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this capsule?')) {
                                      handleDeleteCapsule(capsule.id);
                                    }
                                  }}
                                  className="border-white/30 text-red-300 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              {/* Seal Info */}
                              {capsule.status === 'sealed' && capsule.unlockDate && (
                                <div className="mt-3 p-3 bg-red-500/20 rounded-lg text-center border border-red-500/30">
                                  <p className="text-xs text-red-300">Unlocks on</p>
                                  <p className="font-bold text-white">
                                    {new Date(capsule.unlockDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Gallery Tab Content */}
              {activeTab === 'gallery' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">📸 Your Gallery</h2>
                    <p className="text-gray-300">All your captured memories in one place</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockGalleryItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      >
                        {item.type === 'image' ? (
                          <div 
                            className="h-40 bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.preview})` }}
                          />
                        ) : (
                          <div className="h-40 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
                            <p className="text-white text-center line-clamp-4">{item.preview}</p>
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="text-white font-medium truncate">{item.title}</h3>
                          <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                            <span>❤️ {item.likes}</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Friends Tab Content */}
              {activeTab === 'friends' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">👥 Friend Activity</h2>
                    <p className="text-gray-300">See what your friends are capsule-ing</p>
                  </div>
                  
                  <div className="max-w-2xl mx-auto space-y-4">
                    {mockFriends.map((friend, index) => (
                      <motion.div
                        key={friend.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/20 transition-all cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                          {friend.avatarUrl ? (
                            <img src={friend.avatarUrl} alt={friend.displayName} className="w-full h-full rounded-full" />
                          ) : (
                            '👤'
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{friend.displayName}</h3>
                          <p className="text-gray-400 text-sm">@{friend.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-300 font-medium">{friend.capsulesCount} capsules</p>
                          <Button size="sm" className="mt-2 bg-purple-500 hover:bg-purple-600 text-white">
                            View
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Wrapped Tab Content */}
              {activeTab === 'wrapped' && (
                <PersonalizedWrapped />
              )}
            </>
          )}

          {/* Create Capsule Modal */}
          <AnimatePresence>
            {showCreateModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setShowCreateModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">📦 Create New Capsule</h2>
                    <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Year</label>
                      <select 
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                        value={createForm.year}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      >
                        {years.filter(y => y.year <= CURRENT_YEAR + 1).map(y => (
                          <option key={y.id} value={y.year} className="bg-gray-900">{y.year}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                      <input 
                        type="text"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500"
                        placeholder={`My ${createForm.year} Time Capsule`}
                        value={createForm.title}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                      <textarea 
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 resize-none"
                        placeholder="Describe your capsule..."
                        rows={3}
                        value={createForm.description}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Privacy</label>
                      <div className="flex gap-2">
                        {(['public', 'friends', 'private'] as const).map((vis) => (
                          <Button
                            key={vis}
                            variant={createForm.visibility === vis ? 'default' : 'outline'}
                            onClick={() => setCreateForm(prev => ({ ...prev, visibility: vis }))}
                            className={createForm.visibility === vis 
                              ? 'bg-purple-500 text-white' 
                              : 'border-white/30 text-white hover:bg-white/10'}
                          >
                            {vis === 'public' && <Globe className="w-4 h-4 mr-1" />}
                            {vis === 'friends' && <Users className="w-4 h-4 mr-1" />}
                            {vis === 'private' && <Lock className="w-4 h-4 mr-1" />}
                            {vis.charAt(0).toUpperCase() + vis.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateCapsule}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Capsule Modal */}
          <AnimatePresence>
            {showEditModal && selectedCapsule && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setShowEditModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">✏️ Edit Capsule</h2>
                    <Button variant="ghost" onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                      <input 
                        type="text"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                      <textarea 
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white resize-none"
                        rows={3}
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Cover Image URL</label>
                      <input 
                        type="text"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500"
                        placeholder="https://example.com/image.jpg"
                        value={editForm.coverImage}
                        onChange={(e) => setEditForm(prev => ({ ...prev, coverImage: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Privacy</label>
                      <div className="flex gap-2">
                        {(['public', 'friends', 'private'] as const).map((vis) => (
                          <Button
                            key={vis}
                            variant={editForm.visibility === vis ? 'default' : 'outline'}
                            onClick={() => setEditForm(prev => ({ ...prev, visibility: vis }))}
                            className={editForm.visibility === vis 
                              ? 'bg-purple-500 text-white' 
                              : 'border-white/30 text-white hover:bg-white/10'}
                          >
                            {vis === 'public' && <Globe className="w-4 h-4 mr-1" />}
                            {vis === 'friends' && <Users className="w-4 h-4 mr-1" />}
                            {vis === 'private' && <Lock className="w-4 h-4 mr-1" />}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveEdit}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Seal Modal */}
          <AnimatePresence>
            {showSealModal && selectedCapsule && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => { setShowSealModal(false); setSealWarning(false); }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    🔒 Seal Your Capsule
                  </h2>
                  
                  {!sealWarning ? (
                    <>
                      <p className="text-gray-300 mb-4">
                        Once sealed, your capsule cannot be modified until the unlock date.
                        You can still view and share it!
                      </p>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Unlock Date</label>
                        <select 
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                          value={sealDate}
                          onChange={(e) => setSealDate(e.target.value)}
                        >
                          {getSealDateOptions().map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-gray-900">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="mb-4 p-4 bg-red-500/20 rounded-lg border border-red-500/50">
                      <p className="text-red-300 font-medium text-center">
                        ⚠️ Are you sure you want to seal this capsule?
                      </p>
                      <p className="text-gray-400 text-sm text-center mt-2">
                        This action cannot be undone until {new Date(sealDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => { setShowSealModal(false); setSealWarning(false); }}
                      className="flex-1 border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSealCapsule}
                      className={sealWarning 
                        ? 'flex-1 bg-red-500 hover:bg-red-600 text-white' 
                        : 'flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white'}
                    >
                      {sealWarning ? '🔒 Seal It!' : 'Continue'}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Modal */}
          <AnimatePresence>
            {showSubmitModal && selectedCapsule && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setShowSubmitModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">➕ Add to Your Capsule</h2>
                    <Button variant="ghost" onClick={() => setShowSubmitModal(false)} className="text-gray-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Post Type Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Post Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { type: 'text', icon: '📝', label: 'Text/Status' },
                          { type: 'link', icon: '🔗', label: 'Link/Tweet' },
                          { type: 'image', icon: '📷', label: 'Photo' },
                          { type: 'video', icon: '🎬', label: 'Video' }
                        ] as const).map((postType) => (
                          <Button
                            key={postType.type}
                            variant={submissionForm.type === postType.type ? 'default' : 'outline'}
                            onClick={() => setSubmissionForm(prev => ({ ...prev, type: postType.type }))}
                            className={submissionForm.type === postType.type 
                              ? 'bg-purple-500 text-white' 
                              : 'border-white/30 text-white hover:bg-white/10'}
                          >
                            <span className="mr-1">{postType.icon}</span>
                            {postType.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Date Selection */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Month</label>
                        <select 
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                          value={submissionForm.month}
                          onChange={(e) => {
                            const newMonth = e.target.value;
                            const maxDays = getDaysInMonth(newMonth, selectedCapsule.year);
                            setSubmissionForm(prev => ({ 
                              ...prev, 
                              month: newMonth,
                              day: Math.min(prev.day, maxDays)
                            }));
                          }}
                        >
                          {MONTHS.map(m => (
                            <option key={m} value={m} className="bg-gray-900">{m}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Day</label>
                        <select 
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                          value={submissionForm.day}
                          onChange={(e) => setSubmissionForm(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                        >
                          {Array.from({ length: getDaysInMonth(submissionForm.month, selectedCapsule.year) }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day} className="bg-gray-900">{day}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                      <input 
                        type="text"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                        placeholder="Give your memory a title..."
                        value={submissionForm.title}
                        onChange={(e) => setSubmissionForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    {/* URL/Link Field */}
                    {(submissionForm.type === 'link' || submissionForm.type === 'image' || submissionForm.type === 'video') && (
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          {submissionForm.type === 'link' ? 'Link URL' : 'Media URL'}
                        </label>
                        <input 
                          type="text"
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500"
                          placeholder="https://example.com/..."
                          value={submissionForm.mediaUrl}
                          onChange={(e) => setSubmissionForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                        />
                        {/* URL Preview */}
                        {submissionForm.mediaUrl && (
                          <div className="mt-2 rounded-lg overflow-hidden h-32 bg-white/5">
                            <div 
                              className="h-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${submissionForm.mediaUrl})` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Text Content */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        {submissionForm.type === 'text' ? 'Write your post...' : 'Description'}
                      </label>
                      <textarea 
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white resize-none"
                        placeholder={submissionForm.type === 'text' ? "What's on your mind?" : "Add a description..."}
                        rows={4}
                        value={submissionForm.description}
                        onChange={(e) => setSubmissionForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                      <select 
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                        value={submissionForm.categoryId}
                        onChange={(e) => setSubmissionForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id} className="bg-gray-900">
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSubmitModal(false)}
                      className="flex-1 border-white/30 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddSubmission}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
