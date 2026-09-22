import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  ShieldCheck, 
  BellRing, 
  Send, 
  Trash2, 
  Edit, 
  Search, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  MessageSquare,
  FileText,
  Upload,
  Image as ImageIcon,
  Link,
  Camera
} from 'lucide-react';
import { soundEngine } from '../utils/AudioSynthesizer';
import confetti from 'canvas-confetti';

const PRESET_AVATARS = [
  { label: 'Mother', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Partner', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Doctor', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Security', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { label: 'Friend', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { label: 'Brother', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
];

export default function GuardiansTab({ guardians, setGuardians, onLogActivity }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  // Modal State for Add / Edit Guardian
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuardianId, setEditingGuardianId] = useState(null);
  const [testNotificationMsg, setTestNotificationMsg] = useState(null);

  // Avatar Selection Mode: 'PRESET', 'UPLOAD', 'URL'
  const [avatarInputMode, setAvatarInputMode] = useState('PRESET');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Family Member',
    phone: '',
    email: '',
    priority: 'Primary SOS',
    notes: '',
    avatar: PRESET_AVATARS[0].url,
    channels: {
      sms: true,
      call: true,
      push: true,
      whatsapp: false
    }
  });

  // Filter Guardians safely
  const safeGuardians = guardians || [];
  const filteredGuardians = safeGuardians.filter(g => {
    if (!g) return false;
    const nameStr = g.name || '';
    const relStr = g.relationship || '';
    const phoneStr = g.phone || '';
    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          relStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          phoneStr.includes(searchTerm);
    const matchesPriority = priorityFilter === 'ALL' || g.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleOpenAddModal = () => {
    setEditingGuardianId(null);
    setFormData({
      name: '',
      relationship: 'Family Member',
      phone: '',
      email: '',
      priority: 'Primary SOS',
      notes: '',
      avatar: PRESET_AVATARS[0].url,
      channels: { sms: true, call: true, push: true, whatsapp: false }
    });
    setAvatarInputMode('PRESET');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (guardian) => {
    setEditingGuardianId(guardian.id);
    setFormData({
      name: guardian.name,
      relationship: guardian.relationship,
      phone: guardian.phone,
      email: guardian.email || '',
      priority: guardian.priority,
      notes: guardian.notes || '',
      avatar: guardian.avatar || PRESET_AVATARS[0].url,
      channels: { ...guardian.channels }
    });
    setAvatarInputMode('PRESET');
    setIsModalOpen(true);
  };

  // Handle Local Image File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteGuardian = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your guardians list?`)) {
      soundEngine.playBeep(400, 0.2, 'sawtooth');
      setGuardians(prev => prev.filter(g => g.id !== id));
      onLogActivity({
        type: 'GUARDIAN_REMOVED',
        title: `Guardian Removed: ${name}`,
        description: `Removed ${name} from emergency notification contacts.`,
        severity: 'medium'
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide Guardian Name and Phone Number.");
      return;
    }

    soundEngine.playBeep(700, 0.15);

    if (editingGuardianId) {
      // Edit existing
      setGuardians(prev => prev.map(g => g.id === editingGuardianId ? {
        ...g,
        name: formData.name,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email,
        priority: formData.priority,
        notes: formData.notes,
        avatar: formData.avatar,
        channels: { ...formData.channels }
      } : g));

      onLogActivity({
        type: 'GUARDIAN_UPDATED',
        title: `Guardian Updated: ${formData.name}`,
        description: `Updated contact channels, photo, and priority to ${formData.priority}.`,
        severity: 'info'
      });
    } else {
      // Create new
      const newGuardian = {
        id: `g-${Date.now()}`,
        name: formData.name,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email,
        priority: formData.priority,
        status: 'Verified',
        avatar: formData.avatar,
        channels: { ...formData.channels },
        notes: formData.notes,
        lastVerified: 'Just now'
      };

      setGuardians(prev => [...prev, newGuardian]);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });

      onLogActivity({
        type: 'GUARDIAN_ADDED',
        title: `New Guardian Added: ${formData.name}`,
        description: `Added ${formData.name} (${formData.phone}) with custom photo as ${formData.priority}.`,
        severity: 'info'
      });
    }

    setIsModalOpen(false);
  };

  // Test Ping Trigger
  const handleTestAlert = (guardian) => {
    soundEngine.playBeep(900, 0.2);
    setTestNotificationMsg({
      name: guardian.name,
      phone: guardian.phone,
      time: new Date().toLocaleTimeString()
    });

    onLogActivity({
      type: 'TEST_PING',
      title: `Test Alert Sent to ${guardian.name}`,
      description: `Dispatched non-emergency test ping to ${guardian.phone}. Channels verified!`,
      severity: 'low'
    });

    setTimeout(() => {
      setTestNotificationMsg(null);
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Test Notification Banner Alert */}
      {testNotificationMsg && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0, 242, 254, 0.2))',
          border: '1px solid var(--status-green)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={24} color="var(--status-green)" />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>
                Test Ping Successfully Dispatched!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sent test location ping to <strong>{testNotificationMsg.name}</strong> ({testNotificationMsg.phone}) at {testNotificationMsg.time}.
              </div>
            </div>
          </div>
          <span className="badge badge-green">SMS & PUSH VERIFIED</span>
        </div>
      )}

      {/* Top Banner & Guardian Statistics */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={24} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Emergency Guardian Network</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Add, manage, and test trusted contacts who receive instant SOS alerts, live GPS pins, and phone calls.
            </p>
          </div>

          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <UserPlus size={18} />
            <span>Add Guardian Contact</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-glass)'
        }}>
          <div style={{ background: 'rgba(10, 15, 26, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Guardians</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{guardians.length}</div>
          </div>

          <div style={{ background: 'rgba(10, 15, 26, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary SOS Contacts</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-red)', marginTop: '2px' }}>
              {guardians.filter(g => g.priority === 'Primary SOS').length}
            </div>
          </div>

          <div style={{ background: 'rgba(10, 15, 26, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Network Health</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--status-green)', marginTop: '2px' }}>
              100% Verified
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by name, relationship, or phone number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'Primary SOS', 'Secondary SOS', 'Medical Priority'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`btn btn-sm ${priorityFilter === p ? 'btn-cyan' : 'btn-secondary'}`}
            >
              {p === 'ALL' ? 'All Tiers' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Guardians List Grid */}
      {filteredGuardians.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', background: 'rgba(16, 22, 37, 0.7)' }}>
          <Users size={44} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>No Guardian Contacts Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', marginBottom: '16px' }}>
            {searchTerm || priorityFilter !== 'ALL' 
              ? 'No contacts matched your search filter criteria.' 
              : 'You have not added any emergency guardian contacts yet.'}
          </p>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <UserPlus size={16} />
            <span>Add First Guardian Contact</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredGuardians.map((guardian) => (
          <div 
            key={guardian.id} 
            className="glass-panel" 
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: guardian.priority === 'Primary SOS' ? '4px solid var(--primary-red)' : '4px solid var(--accent-cyan)'
            }}
          >
            <div>
              {/* Card Top: Avatar & Priority */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={guardian.avatar || PRESET_AVATARS[0].url}
                    alt={guardian.name}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--border-glass)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{guardian.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{guardian.relationship}</p>
                  </div>
                </div>

                <span className={`badge ${guardian.priority === 'Primary SOS' ? 'badge-red' : 'badge-cyan'}`}>
                  {guardian.priority}
                </span>
              </div>

              {/* Contact Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', margin: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: '600' }}>
                  <Phone size={15} color="var(--accent-cyan)" />
                  <span>{guardian.phone}</span>
                </div>
                {guardian.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Mail size={15} />
                    <span>{guardian.email}</span>
                  </div>
                )}
                {guardian.notes && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-dim)',
                    background: 'rgba(10, 15, 26, 0.5)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '4px'
                  }}>
                    <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {guardian.notes}
                  </div>
                )}
              </div>

              {/* Notification Channel Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '12px 0' }}>
                {guardian.channels.sms && (
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                    <Smartphone size={10} /> SMS
                  </span>
                )}
                {guardian.channels.call && (
                  <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                    <Phone size={10} /> AUTO-CALL
                  </span>
                )}
                {guardian.channels.push && (
                  <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                    <BellRing size={10} /> PUSH
                  </span>
                )}
                {guardian.channels.whatsapp && (
                  <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                    <MessageSquare size={10} /> WHATSAPP
                  </span>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-glass)'
            }}>
              <button
                className="btn btn-cyan btn-sm"
                onClick={() => handleTestAlert(guardian)}
                title="Send simulated test ping to verify channels"
              >
                <Send size={14} />
                <span>Test Alert</span>
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenEditModal(guardian)}
                  title="Edit Guardian details and photo"
                >
                  <Edit size={14} />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteGuardian(guardian.id, guardian.name)}
                  title="Remove Guardian"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* ADD / EDIT GUARDIAN MODAL WITH MANUAL PHOTO UPLOAD */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(9, 13, 22, 0.88)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div className="glass-panel" style={{ maxWidth: '580px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '18px' }}>
              {editingGuardianId ? 'Edit Guardian Details & Photo' : 'Add New Emergency Guardian'}
            </h3>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* MANUAL GUARDIAN IMAGE SELECTOR SECTION */}
              <div style={{
                background: 'rgba(10, 15, 26, 0.8)',
                border: '1px solid var(--border-glass)',
                padding: '16px',
                borderRadius: 'var(--radius-md)'
              }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                  Guardian Contact Photo
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {/* Live Avatar Preview */}
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={formData.avatar} 
                      alt="Guardian Avatar Preview" 
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid var(--accent-cyan)',
                        boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      background: 'var(--accent-cyan)',
                      color: '#090d16',
                      borderRadius: '50%',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Camera size={14} />
                    </div>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setAvatarInputMode('PRESET')}
                        className={`btn btn-sm ${avatarInputMode === 'PRESET' ? 'btn-cyan' : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        <ImageIcon size={12} />
                        <span>Presets</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAvatarInputMode('UPLOAD')}
                        className={`btn btn-sm ${avatarInputMode === 'UPLOAD' ? 'btn-cyan' : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        <Upload size={12} />
                        <span>Upload File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAvatarInputMode('URL')}
                        className={`btn btn-sm ${avatarInputMode === 'URL' ? 'btn-cyan' : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        <Link size={12} />
                        <span>Image URL</span>
                      </button>
                    </div>

                    {/* Mode A: Preset Gallery Grid */}
                    {avatarInputMode === 'PRESET' && (
                      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {PRESET_AVATARS.map((preset, idx) => (
                          <img
                            key={idx}
                            src={preset.url}
                            alt={preset.label}
                            title={preset.label}
                            onClick={() => setFormData({ ...formData, avatar: preset.url })}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              border: formData.avatar === preset.url ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                              opacity: formData.avatar === preset.url ? 1 : 0.6,
                              transition: 'all 0.2s ease'
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Mode B: Manual File Upload */}
                    {avatarInputMode === 'UPLOAD' && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="input-field"
                          style={{ fontSize: '0.8rem', padding: '6px' }}
                        />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                          Upload JPG or PNG from device (max 5MB).
                        </span>
                      </div>
                    )}

                    {/* Mode C: Custom Image URL */}
                    {avatarInputMode === 'URL' && (
                      <input
                        type="url"
                        className="input-field"
                        placeholder="Paste direct image URL (https://...)"
                        value={formData.avatar}
                        onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                        style={{ fontSize: '0.85rem' }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* GUARDIAN FORM FIELDS */}
              <div>
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Sarah Connor"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Relationship</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Sister, Partner, Neighbor"
                    value={formData.relationship}
                    onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                  />
                </div>

                <div>
                  <label>Priority Tier</label>
                  <select
                    className="input-field"
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Primary SOS">Primary SOS (1st Call)</option>
                    <option value="Secondary SOS">Secondary SOS</option>
                    <option value="Medical Priority">Medical Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="guardian@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label>Emergency Alert Channels</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff' }}>
                    <input
                      type="checkbox"
                      checked={formData.channels.sms}
                      onChange={e => setFormData({ ...formData, channels: { ...formData.channels, sms: e.target.checked } })}
                    />
                    <span>SMS Alert</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff' }}>
                    <input
                      type="checkbox"
                      checked={formData.channels.call}
                      onChange={e => setFormData({ ...formData, channels: { ...formData.channels, call: e.target.checked } })}
                    />
                    <span>Automated Call</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff' }}>
                    <input
                      type="checkbox"
                      checked={formData.channels.push}
                      onChange={e => setFormData({ ...formData, channels: { ...formData.channels, push: e.target.checked } })}
                    />
                    <span>Push Notification</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff' }}>
                    <input
                      type="checkbox"
                      checked={formData.channels.whatsapp}
                      onChange={e => setFormData({ ...formData, channels: { ...formData.channels, whatsapp: e.target.checked } })}
                    />
                    <span>WhatsApp Ping</span>
                  </label>
                </div>
              </div>

              <div>
                <label>Custom Notes / Access Info</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="e.g. Has door passcode 4920, lives nearby."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGuardianId ? 'Save Changes' : 'Add Guardian'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
