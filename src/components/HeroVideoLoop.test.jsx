import { render } from '@testing-library/react';
import HeroVideoLoop from './HeroVideoLoop';

describe('HeroVideoLoop', () => {
  it('renders two video layers seeded with the first two clips', () => {
    const { container } = render(<HeroVideoLoop />);
    const videos = container.querySelectorAll('video');
    expect(videos).toHaveLength(2);
    expect(videos[0]).toHaveAttribute('src', '/workflow.mp4');
    expect(videos[1]).toHaveAttribute('src', '/data-center.mp4');
  });

  it('gives every layer the shared poster and eager preload', () => {
    const { container } = render(<HeroVideoLoop />);
    container.querySelectorAll('video').forEach((v) => {
      expect(v).toHaveAttribute('poster', '/hero-poster.jpg');
      expect(v).toHaveAttribute('preload', 'auto');
      expect(v).toHaveAttribute('playsinline');
    });
  });

  it('renders the legibility scrim overlay', () => {
    const { container } = render(<HeroVideoLoop />);
    expect(container.querySelector('.hero-video-scrim')).toBeInTheDocument();
  });

  it('marks the second layer hidden at rest (layer A active)', () => {
    const { container } = render(<HeroVideoLoop />);
    const videos = container.querySelectorAll('video');
    expect(videos[0].className).not.toContain('hero-video--hidden');
    expect(videos[1].className).toContain('hero-video--hidden');
  });
});
