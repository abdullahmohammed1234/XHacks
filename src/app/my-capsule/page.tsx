'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NostalgiaBackground } from '@/components/features/nostalgia-background';
import { PersonalizedWrapped } from '@/components/features/personalized-wrapped';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { years, categories } from '@/data/seed';
import { PersonalCapsule, CapsuleSubmission, CapsuleStatus } from '@/types';
import { cn } from '@/lib/utils';

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

const mockCapsules: PersonalCapsule[] = [
  {
    id: 'capsule-2024',
    userId: 'user-1',
    year: 2024,
    title: 'My 2024 Rewind',
    description: 'A year of AI, elections, and new beginnings',
    status: 'open',
    visibility: 'public',
    createdAt: '2024-01-01',
    updatedAt: '2024-12-01',
    submissions: [
      {
        id: 'sub-1',
        capsuleId: 'capsule-2024',
        userId: 'user-1',
        type: 'image',
        title: 'Summer Vacation Photo',
        content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        category: 'style',
        month: 'July',
        tags: ['travel', 'summer', 'memories'],
        likes: 12,
        comments: 3,
        createdAt: '2024-07-15',
        isPinned: true
      },
      {
        id: 'sub-2',
        capsuleId: 'capsule-2024',
        userId: 'user-1',
        type: 'text',
        title: 'Favorite Song of the Year',
        content: 'Espresso by Sabrina Carpenter - this song defined my summer!',
        category: 'music',
        month: 'August',
        tags: ['music', 'favorite', 'summer'],
        likes: 8,
        comments: 2,
        createdAt: '2024-08-20',
        isPinned: false
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    isFavorite: true,
    shareCode: 'CAP-2024-XYZ'
  },
  {
    id: 'capsule-2023',
    userId: 'user-1',
    year: 2023,
    title: 'My 2023 Time Capsule',
    description: 'The year of Barbenheimer and AI',
    status: 'sealed',
    visibility: 'friends',
    createdAt: '2023-01-01',
    updatedAt: '2023-12-31',
    sealedAt: '2023-12-31',
    unlockDate: '2028-12-31',
    submissions: [
      {
        id: 'sub-3',
        capsuleId: 'capsule-2023',
        userId: 'user-1',
        type: 'image',
        title: 'Barbie Movie Night',
        content: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
        category: 'tv',
        month: 'July',
        tags: ['barbie', 'movies', 'friends'],
        likes: 25,
        comments: 7,
        createdAt: '2023-07-21',
        isPinned: true
      }
    ],
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    isFavorite: false
  }
];

export default function MyCapsulePage() {
  const [capsules, setCapsules] = useState<PersonalCapsule[]>(mockCapsules);
  const [selectedCapsule, setSelectedCapsule] = useState<PersonalCapsule | null>(null);
  const [showSealModal, setShowSealModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'capsules' | 'gallery' | 'friends' | 'wrapped'>('capsules');

  const getStatusBadge = (status: CapsuleStatus) => {
    const styles = {
      open: 'bg-green-500',
      sealed: 'bg-red-500',
      unlocked: 'bg-blue-500'
    };
    return (
      <Badge className={cn(styles[status], 'text-white')}>
        {status === 'open' ? '🔓 Open' : status === 'sealed' ? '🔒 Sealed' : '✨ Unlocked'}
      </Badge>
    );
  };

  const handleSealCapsule = (capsuleId: string, unlockDate: string) => {
    setCapsules(prev => prev.map(c => 
      c.id === selectedCapsule.id 
        ? { 
            ...c, 
            status: 'sealed', 
            sealedAt: new Date().toISOString(),
            unlockDate 
          }
        : c
    ));
    
    // Update Firebase if logged in
    if (user) {
      try {
        await updateDoc(doc(db, COLLECTIONS.CAPSULES, capsuleId), {
          isSealed: true,
          sealedUntil: unlockDate,
          updatedAt: now
        });
      } catch (error) {
        console.error('Error sealing capsule:', error);
      }
    }
    
    setShowSealModal(false);
    setSealWarning(false);
  };

  const handleAddSubmission = (capsuleId: string, submission: Partial<CapsuleSubmission>) => {
    const newSubmission: CapsuleSubmission = {
      id: `sub-${Date.now()}`,
      capsuleId,
      userId: 'user-1',
      type: submission.type || 'text',
      title: submission.title || '',
      content: submission.content || '',
      category: submission.category || 'other',
      month: submission.month,
      tags: submission.tags || [],
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      isPinned: false
    };
    
    // Update local state
    setCapsules(prev => prev.map(c => 
      c.id === capsuleId 
        ? { ...c, submissions: [...c.submissions, newSubmission] }
        : c
    ));
    
    // Update Firebase if logged in
    if (user) {
      try {
        const capsule = capsules.find(c => c.id === capsuleId);
        if (capsule) {
          await updateDoc(doc(db, COLLECTIONS.CAPSULES, capsuleId), {
            entries: [...capsule.entries, newEntry],
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error adding submission:', error);
      }
    }
    
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
  
  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    setUploadError(null);
  };
  
  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Handle add entry (with or without files)
  const handleAddEntry = async () => {
    if (!user || !selectedCapsule) return;
    
    // Require at least title or files
    if (!uploadTitle.trim() && selectedFiles.length === 0) {
      setUploadError('Please add a title or upload at least one file');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      let newEntries: PersonalCapsuleEntry[] = [];
      
      if (selectedFiles.length > 0) {
        // Upload files to Firebase Storage
        const uploadResults = await uploadCapsuleMedia(
          selectedFiles,
          user.uid,
          selectedCapsule.id,
          (fileIndex, progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [fileIndex]: progress,
            }));
          }
        );
        
        // Create entries for each uploaded file
        newEntries = uploadResults.map((result, index) => ({
          id: `entry-${Date.now()}-${index}`,
          userId: user.uid,
          yearId: selectedCapsule.yearId,
          categoryId: 'media',
          title: uploadTitle || `Media ${index + 1}`,
          description: uploadDescription || '',
          mediaUrl: result.url,
          mediaType: result.fileType as 'image' | 'video',
          thumbnailUrl: result.fileType === 'video' ? result.url : undefined,
          fileSize: result.fileSize,
          contentType: result.contentType,
          createdAt: new Date().toISOString(),
          isPublic: true,
        }));
      } else {
        // Create text-only entry
        newEntries = [{
          id: `entry-${Date.now()}`,
          userId: user.uid,
          yearId: selectedCapsule.yearId,
          categoryId: 'text',
          title: uploadTitle || 'Text Entry',
          description: uploadDescription || '',
          mediaType: 'text' as const,
          createdAt: new Date().toISOString(),
          isPublic: true,
        }];
      }
      
      // Update local state
      setCapsules((prev) => prev.map((c) => 
        c.id === selectedCapsule.id 
          ? { ...c, entries: [...c.entries, ...newEntries], updatedAt: new Date().toISOString() }
          : c
      ));
      
      // Update Firebase
      await updateDoc(doc(db, COLLECTIONS.CAPSULES, selectedCapsule.id), {
        entries: [...selectedCapsule.entries, ...newEntries],
        updatedAt: new Date().toISOString(),
      });
      
      // Reset form and close modal
      resetUploadForm();
      setShowSubmitModal(false);
    } catch (error: any) {
      console.error('Error adding entry:', error);
      setUploadError(error.message || 'Failed to add entry');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Reset upload form
  const resetUploadForm = () => {
    setUploadTitle('');
    setUploadDescription('');
    setSelectedFiles([]);
    setUploadProgress({});
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Open submit modal and reset form
  const openSubmitModal = (capsule: CapsuleWithStringDates) => {
    setSelectedCapsule(capsule);
    resetUploadForm();
    setShowSubmitModal(true);
  };

  const handleCreateCapsule = async () => {
    const year = new Date().getFullYear();
    const newCapsule: CapsuleWithStringDates = {
      id: `capsule-${Date.now()}`,
      userId: user?.uid || 'demo',
      yearId: String(year),
      title: `My ${year} Rewind`,
      description: 'Start building your capsule!',
      entries: [],
      isSealed: false,
      allowSubmissions: true,
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Update local state
    setCapsules([newCapsule, ...capsules]);
    
    // Save to Firebase if logged in
    if (user) {
      try {
        await setDoc(doc(db, COLLECTIONS.CAPSULES, newCapsule.id), newCapsule);
      } catch (error) {
        console.error('Error creating capsule:', error);
      }
    }
  };

  // Show loading state
  if (authLoading || pageLoading) {
    return (
      <NostalgiaBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-pulse">📦</div>
            <p className="text-xl text-retro-gray">Loading...</p>
          </div>
        </div>
      </NostalgiaBackground>
    );
  }

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
          {/* Header */}
          <AnimatedSection animation="fadeUp">
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
                <h1 className="text-4xl md:text-5xl font-bold text-retro-dark mb-2">
                  MyCapsule
                </h1>
                <p className="text-xl text-retro-gray">
                  Create and manage your personal rewinds
                </p>
              </div>
              
              {/* User Profile Summary */}
              <Card className="shrink-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={mockUser.avatarUrl} 
                      alt={mockUser.displayName}
                      className="w-16 h-16 rounded-full bg-retro-teal/20"
                    />
                    <div>
                      <p className="font-bold text-retro-dark">{mockUser.displayName}</p>
                      <p className="text-sm text-retro-gray">@{mockUser.username}</p>
                      <div className="flex gap-2 text-sm mt-1">
                        <span>📦 {mockUser.capsulesCount}</span>
                        <span>👥 {mockUser.followers}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>

          {/* Tabs */}
          <AnimatedSection animation="fadeUp" delay={0.1}>
            <div className="flex justify-center gap-2 mb-8">
              {(['capsules', 'gallery', 'friends', 'wrapped'] as const).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab)}
                  className="capitalize"
                >
                  {tab === 'capsules' && '📦'} {tab === 'gallery' && '🖼️'} {tab === 'friends' && '👥'} {tab === 'wrapped' && '✨'}
                  {' '}{tab}
                </Button>
              ))}
            </div>
          </AnimatedSection>

          {/* Create New Capsule Button */}
          <AnimatedSection animation="fadeUp" delay={0.2}>
            <div className="text-center mb-8">
              <Button 
                size="lg" 
                onClick={() => {
                  const newCapsule: PersonalCapsule = {
                    id: `capsule-${Date.now()}`,
                    userId: 'user-1',
                    year: new Date().getFullYear(),
                    title: `My ${new Date().getFullYear()} Rewind`,
                    description: 'Start building your capsule!',
                    status: 'open',
                    visibility: 'public',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    submissions: [],
                    isFavorite: false
                  };
                  setCapsules([newCapsule, ...capsules]);
                }}
              >
                ➕ Create New Capsule
              </Button>
            </div>
          </AnimatedSection>

          {/* Capsules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.map((capsule, index) => (
              <AnimatedSection key={capsule.id} animation="fadeUp" delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className={cn(
                      'h-full cursor-pointer transition-all duration-300',
                      selectedCapsule?.id === capsule.id && 'ring-2 ring-retro-teal'
                    )}
                    onClick={() => setSelectedCapsule(capsule)}
                  >
                    {capsule.coverImage && (
                      <div 
                        className="h-40 bg-cover bg-center rounded-t-xl"
                        style={{ backgroundImage: `url(${capsule.coverImage})` }}
                      />
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{capsule.year}</Badge>
                        {getStatusBadge(capsule.status)}
                      </div>
                      <CardTitle className="text-xl">{capsule.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-retro-gray text-sm mb-4 line-clamp-2">
                        {capsule.description}
                      </p>
                      
                      {/* Submissions Preview */}
                      <div className="flex gap-2 mb-4">
                        {capsule.submissions.slice(0, 3).map((sub, i) => (
                          <div 
                            key={sub.id}
                            className="w-10 h-10 rounded-full bg-retro-teal/20 flex items-center justify-center text-lg"
                          >
                            {sub.type === 'image' && '📷'}
                            {sub.type === 'video' && '🎬'}
                            {sub.type === 'text' && '📝'}
                            {sub.type === 'audio' && '🎵'}
                          </div>
                        ))}
                        {capsule.submissions.length > 3 && (
                          <div className="w-10 h-10 rounded-full bg-retro-purple/20 flex items-center justify-center text-sm font-bold">
                            +{capsule.submissions.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {capsule.status === 'open' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCapsule(capsule);
                                setShowSubmitModal(true);
                              }}
                              className="flex-1"
                            >
                              ➕ Add
                            </Button>
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCapsule(capsule);
                                setShowSealModal(true);
                              }}
                              className="flex-1"
                            >
                              🔒 Seal
                            </Button>
                          </>
                        )}
                        {capsule.status === 'sealed' && capsule.shareCode && (
                          <Button size="sm" variant="outline" className="flex-1">
                            🔗 Share
                          </Button>
                        )}
                        {capsule.status === 'open' && capsule.visibility === 'public' && (
                          <Button size="sm" variant="outline" className="flex-1">
                            👥 Public
                          </Button>
                        )}
                      </div>

                      {/* Seal Info */}
                      {capsule.status === 'sealed' && capsule.unlockDate && (
                        <div className="mt-3 p-2 bg-red-50 rounded-lg text-center">
                          <p className="text-xs text-retro-gray">Unlocks</p>
                          <p className="font-bold text-red-600">
                            {new Date(capsule.unlockDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

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

          {/* Submit Modal with File Upload */}
          <AnimatePresence>
            {showSubmitModal && selectedCapsule && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowSubmitModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-bold text-retro-dark mb-4">
                    ➕ Add to Your Capsule
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <div className="flex gap-2 flex-wrap">
                        {(['image', 'video', 'text', 'audio'] as const).map((type) => (
                          <Button
                            key={type}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleAddSubmission(selectedCapsule.id, {
                                type,
                                title: `New ${type}`,
                                content: type === 'image' ? 'https://example.com/image.jpg' : 'Sample content',
                                category: 'other',
                                month: 'December'
                              });
                            }}
                          >
                            {type === 'image' && '📷'}
                            {type === 'video' && '🎬'}
                            {type === 'text' && '📝'}
                            {type === 'audio' && '🎵'}
                            {' '}{type.charAt(0).toUpperCase() + type.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-retro-gray">
                      Quick add demo: Click any type above to add a sample submission to your capsule!
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSubmitModal(false)}
                      className="w-full"
                    >
                      Close
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
