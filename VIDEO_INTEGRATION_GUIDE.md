# 🎥 Video Integration Guide for ÉquiSettle Documentation

## Overview

The ÉquiSettle documentation site now supports professional video embedding with a custom React component that handles multiple video platforms and provides a consistent user experience.

## Video Component Features

### ✨ **Supported Platforms**
- **YouTube** - Public and unlisted videos
- **Vimeo** - Public and private videos
- **Loom** - Screen recordings and tutorials
- **Local Videos** - Self-hosted MP4/WebM files

### 🎨 **Professional Features**
- **Responsive Design** - Works on all devices
- **Loading States** - Smooth loading experience
- **Error Handling** - Graceful error messages
- **Dark Mode Support** - Adapts to documentation theme
- **Accessibility** - Screen reader and keyboard friendly
- **Auto-detection** - Automatically detects video platform from URL

## Usage Examples

### Basic YouTube Video

```markdown
import VideoEmbed from '@site/src/components/VideoEmbed';

<VideoEmbed
  src="https://www.youtube.com/watch?v=VIDEO_ID"
  title="Platform Overview"
  description="Learn about the ÉquiSettle platform features"
  type="youtube"
  duration="15:30"
/>
```

### Vimeo with Custom Settings

```markdown
<VideoEmbed
  src="https://vimeo.com/123456789"
  title="Advanced Tutorial"
  description="Deep dive into advanced features"
  type="vimeo"
  duration="22:15"
  height="500px"
  autoplay={false}
/>
```

### Loom Screen Recording

```markdown
<VideoEmbed
  src="https://www.loom.com/share/abc123def456"
  title="Development Walkthrough"
  description="Step-by-step development guide"
  type="loom"
  duration="12:45"
/>
```

### Self-Hosted Local Video

```markdown
<VideoEmbed
  src="/videos/demo.mp4"
  title="Live Platform Demo"
  description="See the platform in action"
  type="local"
  duration="18:20"
  showControls={true}
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | Video URL or path |
| `title` | string | required | Video title |
| `description` | string | optional | Video description |
| `type` | 'youtube' \| 'vimeo' \| 'loom' \| 'local' | 'youtube' | Video platform |
| `duration` | string | optional | Video duration (e.g., "15:30") |
| `height` | string | '400px' | Video height |
| `width` | string | '100%' | Video width |
| `autoplay` | boolean | false | Auto-play video |
| `showControls` | boolean | true | Show video controls |
| `thumbnail` | string | optional | Custom thumbnail URL |

## Video Organization

### Directory Structure

```
static/videos/
├── tutorials/
│   ├── getting-started.mp4
│   ├── api-integration.mp4
│   └── troubleshooting.mp4
├── demos/
│   ├── platform-overview.mp4
│   ├── case-management.mp4
│   └── ai-features.mp4
├── training/
│   ├── developer-onboarding.mp4
│   ├── user-training.mp4
│   └── admin-guide.mp4
└── screenshots/
    ├── thumbnails/
    └── placeholders/
```

### File Naming Convention

- Use kebab-case: `case-management-demo.mp4`
- Include section prefix: `backend-api-tutorial.mp4`
- Version if needed: `setup-guide-v2.mp4`
- Keep names descriptive but concise

## Best Practices

### 📱 **Responsive Design**
- Videos automatically adapt to screen size
- Mobile-optimized controls and sizing
- Touch-friendly interaction

### ⚡ **Performance**
- Use appropriate video compression
- Provide multiple formats (MP4, WebM) for local videos
- Consider video length for page load times

### 🎯 **User Experience**
- Always provide titles and descriptions
- Include video duration when possible
- Use consistent styling across documentation

### 🔐 **Security Considerations**
- **YouTube/Vimeo**: Use unlisted videos for internal content
- **Loom**: Set appropriate sharing permissions
- **Local Videos**: Store in `/static/videos/` directory
- **Private Content**: Consider password protection or team-only access

## Platform-Specific Setup

### YouTube Videos

1. **Public Videos**: Use any YouTube URL
2. **Unlisted Videos**: Share unlisted link for internal training
3. **Private Videos**: Not supported (use other platforms)

```markdown
<!-- Standard YouTube video -->
<VideoEmbed
  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Public Tutorial"
  type="youtube"
/>

<!-- YouTube with custom parameters -->
<VideoEmbed
  src="https://youtu.be/dQw4w9WgXcQ"
  title="Training Video"
  type="youtube"
  autoplay={false}
/>
```

### Vimeo Videos

1. **Public Videos**: Use standard Vimeo URL
2. **Private Videos**: Ensure proper sharing settings
3. **Password Protected**: May require additional setup

```markdown
<VideoEmbed
  src="https://vimeo.com/123456789"
  title="Professional Demo"
  type="vimeo"
  description="High-quality platform demonstration"
/>
```

### Loom Videos

1. **Shared Links**: Use the share URL from Loom
2. **Team Access**: Configure team permissions in Loom
3. **Expiration**: Be aware of link expiration settings

```markdown
<VideoEmbed
  src="https://www.loom.com/share/abc123def456ghi789"
  title="Screen Recording Tutorial"
  type="loom"
  duration="10:30"
/>
```

### Local Videos

1. **File Formats**: MP4 (primary), WebM (fallback)
2. **Storage**: Place in `/static/videos/` directory
3. **Size**: Optimize file size for web delivery

```markdown
<VideoEmbed
  src="/videos/training/developer-setup.mp4"
  title="Development Environment Setup"
  type="local"
  showControls={true}
/>
```

## Advanced Customization

### Custom Styling

Create custom CSS for specific video sections:

```css
/* Custom video styling */
.custom-video-section .videoContainer {
  border: 2px solid #your-brand-color;
  border-radius: 16px;
}

.custom-video-section .videoHeader {
  background: linear-gradient(45deg, #color1, #color2);
}
```

### Video Playlists

Group related videos in sections:

```markdown
## Tutorial Series: Getting Started

### Part 1: Environment Setup
<VideoEmbed ... />

### Part 2: First API Call
<VideoEmbed ... />

### Part 3: Error Handling
<VideoEmbed ... />
```

### Interactive Elements

Add call-to-action buttons after videos:

```markdown
<VideoEmbed ... />

**Next Steps:**
- [Follow the written guide](/docs/backend/getting-started/setup)
- [Try the interactive tutorial](/docs/backend/api/authentication)
- [Join our developer community](https://discord.gg/equisettle)
```

## Content Strategy

### Video Types by Audience

#### **For Developers**
- Code walkthroughs
- API integration tutorials
- Debugging sessions
- Architecture explanations

#### **For Users**
- Feature demonstrations
- User interface tours
- Workflow walkthroughs
- Best practice guides

#### **For Administrators**
- System configuration
- User management
- Integration setup
- Maintenance procedures

### Video Length Guidelines

- **Quick Tips**: 2-5 minutes
- **Tutorials**: 10-20 minutes
- **Deep Dives**: 20-45 minutes
- **Workshops**: 45+ minutes (consider breaking into parts)

## Maintenance and Updates

### Regular Review Schedule
- **Monthly**: Check for broken video links
- **Quarterly**: Update outdated content
- **Annually**: Review video strategy and metrics

### Version Control
- Include video descriptions in documentation updates
- Track video changes in commit messages
- Archive old videos when updating

### Performance Monitoring
- Monitor video loading times
- Track user engagement metrics
- Optimize based on user feedback

## Troubleshooting

### Common Issues

#### Video Not Loading
```markdown
<!-- Check URL format -->
❌ Wrong: https://youtube.com/watch?v=ABC123
✅ Correct: https://www.youtube.com/watch?v=ABC123

<!-- Verify video privacy settings -->
- YouTube: Check if video is public/unlisted
- Vimeo: Verify sharing permissions
- Loom: Ensure link hasn't expired
```

#### Responsive Issues
```css
/* Force responsive behavior */
.videoWrapper {
  max-width: 100%;
  height: auto;
}
```

#### Autoplay Problems
```markdown
<!-- Most browsers block autoplay -->
<VideoEmbed
  autoplay={false}  <!-- Recommended -->
  showControls={true}
/>
```

## Security and Privacy

### Content Guidelines
- ✅ Use unlisted YouTube videos for internal content
- ✅ Set appropriate Loom sharing permissions
- ✅ Host sensitive content locally with authentication
- ❌ Don't embed private/confidential content in public videos

### GDPR Compliance
- Include privacy notices for external video platforms
- Consider cookie implications of embedded videos
- Provide alternatives for users who disable video embeds

## Future Enhancements

### Planned Features
- [ ] Video chapters/timestamps
- [ ] Interactive video annotations
- [ ] Video transcripts for accessibility
- [ ] Analytics integration
- [ ] Offline video support

### Integration Possibilities
- Video search functionality
- Automatic thumbnail generation
- Video progress tracking
- Integration with learning management systems

---

**Need Help?**

- 📧 Technical Issues: Contact the development team
- 💡 Feature Requests: Submit GitHub issues
- 📝 Content Updates: Follow documentation contribution guidelines

---

*This guide is regularly updated to reflect new features and best practices. Last updated: October 2024*