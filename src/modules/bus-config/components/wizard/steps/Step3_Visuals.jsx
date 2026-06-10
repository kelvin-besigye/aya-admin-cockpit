import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon, Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * WIZARD STEP 3: VISUAL PROFILE
 * ------------------------------------------------------------------
 * The "Showroom" Step.
 * 1. PROFILE IMAGE: The main thumbnail (Search Result Card).
 * 2. GALLERY: Interior/Exterior shots (Detail View).
 * 3. LOGIC: Handles local file previews using Blob URLs.
 */

const Step3_Visuals = ({ data, onChange }) => {
  
  // REFS (For triggering hidden file inputs)
  const profileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // 1. HANDLER: PROFILE UPLOAD (Single File)
  const handleProfileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local preview URL instantly
    const previewUrl = URL.createObjectURL(file);
    
    // In a real app, you'd verify size/type here
    onChange({
      ...data,
      profile_image: { file, preview: previewUrl }
    });
  };

  // 2. HANDLER: GALLERY UPLOAD (Multiple Files)
  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Convert to objects with preview URLs
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    onChange({
      ...data,
      gallery_images: [...(data.gallery_images || []), ...newImages]
    });
  };

  // 3. HANDLER: REMOVE IMAGE
  const removeGalleryImage = (index) => {
    const updatedGallery = [...(data.gallery_images || [])];
    updatedGallery.splice(index, 1);
    onChange({ ...data, gallery_images: updatedGallery });
  };

  const removeProfileImage = () => {
    onChange({ ...data, profile_image: null });
  };

  // 4. VALIDATION STATUS
  // Requirement: 1 Profile + Min 3 Gallery = 4 Total
  const galleryCount = data.gallery_images?.length || 0;
  const hasProfile = !!data.profile_image;
  const isComplete = hasProfile && galleryCount >= 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%' }}>
      
      {/* HEADER WITH PROGRESS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 className="text-heading" style={{ fontSize: '16px', margin: '0 0 4px 0' }}>Visual Profile</h3>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            Upload high-quality photos. Customers buy with their eyes.
          </p>
        </div>
        
        {/* COMPLETION BADGE */}
        <div style={{ 
          padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
          background: isComplete ? 'rgba(22, 163, 74, 0.1)' : 'rgba(234, 179, 8, 0.1)',
          color: isComplete ? 'var(--status-success)' : 'var(--status-warning)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {isComplete ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {isComplete ? 'Ready to Publish' : `Minimum 4 Photos Required`}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flex: 1 }}>

        {/* === LEFT PANEL: THE FACE (Profile Image) === */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Main Profile Photo (1)
          </label>

          <div 
            style={{ 
              flex: 1, border: '2px dashed var(--border-subtle)', borderRadius: '16px',
              background: 'var(--bg-input)', position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: data.profile_image ? 'default' : 'pointer', transition: 'border 0.2s ease'
            }}
            onClick={() => !data.profile_image && profileInputRef.current.click()}
            onMouseEnter={(e) => !data.profile_image && (e.currentTarget.style.borderColor = 'var(--brand-primary)')}
            onMouseLeave={(e) => !data.profile_image && (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            {data.profile_image ? (
              // PREVIEW STATE
              <>
                <img 
                  src={data.profile_image.preview} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <button 
                  onClick={removeProfileImage}
                  style={{ 
                    position: 'absolute', top: '12px', right: '12px', 
                    background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', cursor: 'pointer', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Trash2 size={16} />
                </button>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'var(--brand-primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                  MAIN COVER
                </div>
              </>
            ) : (
              // EMPTY STATE
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--bg-surface)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <ImageIcon size={24} color="var(--brand-primary)" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Click to Upload Cover</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>JPG, PNG up to 5MB</div>
              </div>
            )}
            
            {/* HIDDEN INPUT */}
            <input 
              type="file" 
              ref={profileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleProfileSelect}
            />
          </div>
        </section>


        {/* === RIGHT PANEL: THE TOUR (Gallery) === */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Gallery Views (Min 3)
          </label>

          <div className="citadel-scroll-area" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gridAutoRows: '100px', gap: '12px', padding: '4px' }}>
            
            {/* 1. UPLOAD BUTTON */}
            <div 
              onClick={() => galleryInputRef.current.click()}
              style={{ 
                border: '1px dashed var(--border-subtle)', borderRadius: '12px',
                background: 'var(--bg-input)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'var(--brand-primary)', transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
            >
              <Plus size={24} />
              <span style={{ fontSize: '11px', fontWeight: '700', marginTop: '4px' }}>Add Photo</span>
            </div>

            {/* 2. GALLERY ITEMS */}
            {(data.gallery_images || []).map((img, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <img 
                  src={img.preview} 
                  alt={`Gallery ${i}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <button 
                  onClick={() => removeGalleryImage(i)}
                  style={{ 
                    position: 'absolute', top: '4px', right: '4px', 
                    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                    width: '24px', height: '24px', cursor: 'pointer', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <input 
            type="file" 
            ref={galleryInputRef} 
            style={{ display: 'none' }} 
            multiple 
            accept="image/*"
            onChange={handleGallerySelect}
          />
        </section>

      </div>
    </div>
  );
};

export default Step3_Visuals;