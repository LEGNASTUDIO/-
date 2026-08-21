import React, { useState } from 'react';
import { SiteContent } from '../types';
import { Check, Send, Mail, Instagram } from 'lucide-react';

interface ContactViewProps {
  siteContent: SiteContent;
  initialInquiryTopic?: string;
}

export const ContactView: React.FC<ContactViewProps> = ({
  siteContent,
  initialInquiryTopic = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<string>(
    initialInquiryTopic ? 'WORK' : 'WORK'
  );
  const [message, setMessage] = useState(
    initialInquiryTopic ? `[문의 작품: ${initialInquiryTopic}]\n\n` : ''
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquiryTypes = [
    { value: 'WORK', label: 'WORK (작품 구매/소장)' },
    { value: 'EXHIBITION', label: 'EXHIBITION (전시 문의)' },
    { value: 'COLLABORATION', label: 'COLLABORATION (공간/브랜드 협업)' },
    { value: 'CUSTOM', label: 'CUSTOM (맞춤 오브제 제작)' },
    { value: 'OTHER', label: 'OTHER (기타 문의)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Save to local inquiries archive for admin
    try {
      const existing = JSON.parse(localStorage.getItem('legna_inquiries_v1') || '[]');
      const newInquiry = {
        id: 'inq-' + Date.now(),
        name,
        email,
        inquiryType,
        message,
        date: new Date().toISOString(),
      };
      localStorage.setItem('legna_inquiries_v1', JSON.stringify([newInquiry, ...existing]));
    } catch (err) {
      console.warn('Inquiry store error', err);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="pt-32 sm:pt-40 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 min-h-[85vh] space-y-16">
      {/* Title Header */}
      <div className="border-b border-[#DEDAD2] pb-6 space-y-3">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#77736B] block font-mono">
          INQUIRIES & COMMISSIONS
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-[#171717]">
          CONTACT
        </h1>
        <p className="text-sm sm:text-base text-[#77736B] font-light max-w-xl">
          작품 구매, 전시, 공간 협업 및 커스텀 제작에 대한 문의를 받습니다.
        </p>
      </div>

      {/* Form Content */}
      {isSubmitted ? (
        <div
          id="contact-success-box"
          className="bg-[#EAE6DC]/60 border border-[#DEDAD2] p-10 sm:p-14 text-center space-y-6 animate-in fade-in"
        >
          <div className="w-12 h-12 rounded-full bg-[#171717] text-[#F7F5F0] flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#171717]">
              Thank you.
            </h3>
            <p className="text-sm text-[#77736B] font-light">
              문의가 성공적으로 전달되었습니다. 남겨주신 이메일({email})로 빠른 시일 내에 답변드리겠습니다.
            </p>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setName('');
              setEmail('');
              setMessage('');
            }}
            className="text-xs tracking-[0.2em] uppercase text-[#171717] underline underline-offset-4 pt-4 inline-block hover:text-[#77736B]"
          >
            새로운 문의 작성하기
          </button>
        </div>
      ) : (
        <form
          id="contact-form"
          onSubmit={handleSubmit}
          className="space-y-10"
        >
          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="contact-name"
              className="text-[11px] tracking-[0.2em] uppercase text-[#77736B] font-mono block"
            >
              NAME *
            </label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="성함 또는 기업/스튜디오명"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-[#DEDAD2] focus:border-[#171717] py-3 text-sm text-[#171717] placeholder-[#9E9A91] outline-none transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="contact-email"
              className="text-[11px] tracking-[0.2em] uppercase text-[#77736B] font-mono block"
            >
              EMAIL *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[#DEDAD2] focus:border-[#171717] py-3 text-sm text-[#171717] placeholder-[#9E9A91] outline-none transition-colors"
            />
          </div>

          {/* Inquiry Type Radios/Buttons */}
          <div className="space-y-3">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#77736B] font-mono block">
              INQUIRY TYPE *
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {inquiryTypes.map((type) => {
                const isSelected = inquiryType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setInquiryType(type.value)}
                    className={`text-left p-3.5 border transition-colors text-xs font-mono flex items-center justify-between ${
                      isSelected
                        ? 'border-[#171717] bg-[#171717] text-[#F7F5F0]'
                        : 'border-[#DEDAD2] text-[#77736B] hover:border-[#171717] hover:text-[#171717]'
                    }`}
                  >
                    <span>{type.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label
              htmlFor="contact-message"
              className="text-[11px] tracking-[0.2em] uppercase text-[#77736B] font-mono block"
            >
              MESSAGE *
            </label>
            <textarea
              id="contact-message"
              required
              rows={6}
              placeholder="문의 내용을 자유롭게 작성해 주세요. (희망 일정, 설치 공간, 작품 규격 등)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent border border-[#DEDAD2] focus:border-[#171717] p-4 text-sm text-[#171717] placeholder-[#9E9A91] outline-none transition-colors leading-relaxed resize-y"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs text-[#77736B] font-light">
              평일 기준 1-2일 이내에 회신드립니다.
            </p>
            <button
              id="submit-contact-form-btn"
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 bg-[#171717] text-[#F7F5F0] hover:bg-[#333333] transition-colors text-xs tracking-[0.25em] uppercase font-medium"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Direct Info Footer */}
      <div className="border-t border-[#DEDAD2] pt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-[#77736B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#171717] font-medium font-mono">
            <Mail className="w-4 h-4" />
            <span>DIRECT EMAIL</span>
          </div>
          <a
            href={`mailto:${siteContent.contactEmail || 'contact@legnacraft.com'}`}
            className="block text-[#171717] hover:underline font-mono text-sm"
          >
            {siteContent.contactEmail || 'contact@legnacraft.com'}
          </a>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#171717] font-medium font-mono">
            <Instagram className="w-4 h-4" />
            <span>INSTAGRAM</span>
          </div>
          <a
            href={
              siteContent.instagramUrl && siteContent.instagramUrl.trim()
                ? (siteContent.instagramUrl.startsWith('http') ? siteContent.instagramUrl : `https://${siteContent.instagramUrl}`)
                : siteContent.instagramHandle
                ? (siteContent.instagramHandle.startsWith('http') ? siteContent.instagramHandle : `https://instagram.com/${siteContent.instagramHandle.replace(/^@/, '')}`)
                : 'https://instagram.com'
            }
            target="_blank"
            rel="noreferrer"
            className="block text-[#171717] hover:underline font-mono text-sm"
          >
            {siteContent.instagramHandle
              ? (siteContent.instagramHandle.startsWith('@') ? siteContent.instagramHandle : `@${siteContent.instagramHandle}`)
              : '@legna_hanji'}
          </a>
        </div>
      </div>
    </div>
  );
};
