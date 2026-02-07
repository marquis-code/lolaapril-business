// types/branding.ts - Comprehensive types for branding/storefront system

// ==================== THEME TYPES ====================

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  error: string
  success: string
  muted?: string
  border?: string
  cardBackground?: string
  inputBackground?: string
}

export interface ThemeTypography {
  fontFamily: string
  headingFont: string
  bodyFont: string
  fontSize?: Record<string, string>
  fontWeight?: Record<string, string>
  lineHeight?: Record<string, string>
}

export interface ThemeLogo {
  url: string
  width: number
  height: number
  alt: string
}

export interface ThemeFavicon {
  url: string
}

export interface ThemeCustomCss {
  enabled: boolean
  cssCode: string
}

export interface Theme {
  colors: ThemeColors
  typography: ThemeTypography
  logo?: ThemeLogo
  favicon?: ThemeFavicon
  customCss?: ThemeCustomCss
}

// ==================== HERO SECTION TYPES ====================

export interface HeroGradient {
  from: string
  to: string
  direction?: string
}

export interface HeroSection {
  enabled: boolean
  type: 'image' | 'video' | 'slideshow' | 'gradient'
  coverImage?: string
  slideshowImages?: string[]
  videoUrl?: string
  gradient?: HeroGradient
  headline?: string
  subheadline?: string
  textAlignment: 'left' | 'center' | 'right'
  overlayStyle: 'light' | 'dark' | 'none'
  overlayOpacity: number
  height: string
  showBookButton: boolean
  bookButtonText: string
}

// ==================== SECTION TYPES ====================

export interface StorefrontSection {
  id: string
  type: 'services' | 'staff' | 'gallery' | 'testimonials' | 'about' | 'contact' | 'map' | 'hours' | 'faq' | 'custom'
  title: string
  subtitle?: string
  enabled: boolean
  order: number
  settings?: Record<string, any>
}

// ==================== DISPLAY SETTINGS TYPES ====================

export interface ServiceDisplaySettings {
  layout: 'grid' | 'list' | 'cards'
  columns: number
  showPrices: boolean
  showPricing?: boolean // Alias for API compatibility
  showDuration: boolean
  showDescription: boolean
  showImages: boolean
  showImage?: boolean // Alias for API compatibility
  groupByCategory: boolean
  showFilters?: boolean
  showBookButton?: boolean
}

export interface StaffDisplaySettings {
  layout: 'grid' | 'carousel' | 'list'
  columns: number
  showBio: boolean
  showSpecialties: boolean
  showRatings: boolean
  showRating?: boolean // Alias for API compatibility
  showBookButton?: boolean
  showAvailability?: boolean
  showSocialLinks?: boolean
}

export interface GallerySettings {
  enabled: boolean
  images: string[] | GalleryImage[]
  layout: 'grid' | 'masonry' | 'carousel' | 'featured'
  columns: number
  showLightbox?: boolean
  showCaptions?: boolean
  autoplay?: boolean
}

export interface GalleryImage {
  url: string
  alt?: string
  caption?: string
}

export interface TestimonialsSettings {
  enabled: boolean
  showRating: boolean
  showPhoto?: boolean
  layout: 'carousel' | 'grid' | 'list'
  maxToShow: number
  autoplay?: boolean
  autoplayInterval?: number
}

export interface ContactDisplaySettings {
  showMap: boolean
  showAddress: boolean
  showPhone: boolean
  showEmail: boolean
  showSocialLinks: boolean
  showBusinessHours: boolean
}

// Alias for backward compatibility
export type ContactSettings = ContactDisplaySettings

// ==================== BOOKING FLOW TYPES ====================

export interface BookingFlowSettings {
  flow: 'service-first' | 'staff-first' | 'date-first'
  style?: 'stepped' | 'single' | 'compact'
  showProgress?: boolean
  allowGuestBooking: boolean
  showStaffSelection: boolean
  requireStaffSelection: boolean
  showServiceImages: boolean
  allowMultipleServices: boolean
  datePickerStyle: 'calendar' | 'list' | 'horizontal'
  showAvailableSlots: boolean
  slotDuration: number
  advanceBookingDays: number
  minAdvanceHours: number
  requirePhone?: boolean
  requireEmail?: boolean
  showPolicies?: boolean
  confirmationStyle?: 'modal' | 'page' | 'inline'
}

// ==================== SOCIAL PROOF TYPES ====================

export interface SocialProofSettings {
  showReviewCount: boolean
  showAverageRating: boolean
  showTotalBookings: boolean
  showTrustBadges?: boolean
  showBadges?: boolean
  badges?: string[]
}

// ==================== COMPONENT STYLES TYPES ====================

export interface ButtonStyles {
  borderRadius: string
  style: 'filled' | 'outlined' | 'ghost'
  size: 'small' | 'medium' | 'large'
  uppercase: boolean
  fontWeight: string
}

export interface CardStyles {
  borderRadius: string
  shadow: boolean
  shadowIntensity: 'none' | 'light' | 'medium' | 'strong'
  border: boolean
  borderColor: string
}

export interface ComponentStyles {
  buttons: ButtonStyles
  cards: CardStyles
  inputBorderRadius: string
  sectionSpacing: string
  maxContentWidth: string
}

// ==================== NAVBAR & FOOTER TYPES ====================

export interface NavbarMenuItem {
  label: string
  sectionId?: string
  url?: string
  type?: 'section' | 'url'
}

export interface NavbarConfig {
  style: 'default' | 'transparent' | 'minimal' | 'centered' | 'sticky'
  position?: 'fixed' | 'static' | 'absolute'
  showLogo: boolean
  showBusinessName: boolean
  showBookButton: boolean
  bookButtonText: string
  backgroundColor?: string
  sticky?: boolean
  logoUrl?: string
  menuItems?: NavbarMenuItem[]
  links?: NavbarLink[]
}

export interface NavbarLink {
  label: string
  href: string
}

export interface FooterLink {
  label: string
  url: string
  openInNewTab?: boolean
}

export interface FooterColumn {
  title: string
  links: FooterColumnLink[]
}

export interface FooterColumnLink {
  label: string
  href: string
}

export interface FooterConfig {
  enabled: boolean
  style?: 'simple' | 'minimal' | 'detailed'
  showLogo?: boolean
  showSocialLinks: boolean
  showQuickLinks: boolean
  showContactInfo: boolean
  showNewsletter: boolean
  newsletterText?: string
  copyrightText?: string
  customLinks?: FooterLink[]
  columns?: FooterColumn[]
}

// ==================== SEO TYPES ====================

export interface SeoConfig {
  title?: string
  description?: string
  keywords?: string | string[]
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  canonicalUrl?: string
  indexable?: boolean
  followLinks?: boolean
}

// ==================== STOREFRONT LAYOUT TYPE ====================

export interface StorefrontLayout {
  hero: HeroSection
  sections: StorefrontSection[]
  serviceDisplay: ServiceDisplaySettings
  staffDisplay: StaffDisplaySettings
  gallery: GallerySettings
  testimonials: TestimonialsSettings
  contact: ContactDisplaySettings
  bookingFlow: BookingFlowSettings
  socialProof: SocialProofSettings
}

// ==================== FULL STOREFRONT CONFIG ====================

export interface StorefrontConfig {
  storefront: StorefrontLayout
  componentStyles: ComponentStyles
  navbar: NavbarConfig
  footer: FooterConfig
  seo?: SeoConfig
}

// ==================== CUSTOM DOMAIN TYPES ====================

export interface DnsRecord {
  type: 'CNAME' | 'TXT'
  name: string
  value: string
  verified: boolean
}

export interface CustomDomain {
  id: string
  domain: string
  subdomain: string
  verificationStatus: 'pending' | 'verified' | 'failed'
  sslStatus: 'pending' | 'active' | 'failed' | 'expired'
  dnsRecords: DnsRecord[]
  verifiedAt?: string
  isActive: boolean
  createdAt: string
}

// ==================== EMAIL TEMPLATE TYPES ====================

export type EmailTemplateType = 
  | 'booking_confirmation'
  | 'booking_reminder'
  | 'booking_cancellation'
  | 'welcome'
  | 'password_reset'
  | 'invoice'
  | 'receipt'
  | 'custom'

export interface EmailTemplate {
  id: string
  templateType: EmailTemplateType | string
  subject: string
  htmlContent: string
  textContent?: string
  isCustom: boolean
  isActive: boolean
  variables: string[]
  createdAt: string
  updatedAt?: string
}

// ==================== WIDGET TYPES ====================

export type WidgetDisplayType = 'modal' | 'inline' | 'popup' | 'sidebar'
export type WidgetTheme = 'light' | 'dark' | 'custom'

export interface WidgetConfiguration {
  displayType: WidgetDisplayType
  buttonText: string
  buttonColor: string
  showBranding: boolean
  allowedOrigins?: string[]
}

export interface WidgetStyling {
  theme: WidgetTheme
  primaryColor: string
  borderRadius: string
  fontSize: string
}

export interface BookingWidget {
  id: string
  widgetId: string
  name: string
  configuration: WidgetConfiguration
  styling: WidgetStyling
  embedCode: string
  impressions: number
  conversions: number
  conversionRate?: string
  isActive: boolean
  createdAt: string
}

// ==================== BRANDING OVERVIEW TYPE ====================

export interface BrandingOverview {
  theme: {
    isCustomized: boolean
    colors: ThemeColors
    hasLogo: boolean
    hasFavicon: boolean
    customCssEnabled: boolean
  }
  customDomains: {
    total: number
    verified: number
    pending: number
    domains: CustomDomain[]
  }
  emailTemplates: {
    total: number
    custom: number
    templates: EmailTemplate[]
  }
  widgets: {
    total: number
    totalImpressions: number
    totalConversions: number
    widgets: BookingWidget[]
  }
  summary: {
    brandingComplete: boolean
    setupProgress: number
  }
}

// ==================== UPLOAD RESPONSE TYPE ====================

export interface UploadResponse {
  url: string
  publicId: string
  width?: number
  height?: number
}

// ==================== PREVIEW SESSION TYPE ====================

export interface PreviewSession {
  previewId: string
  previewUrl: string
  expiresIn?: string
}

// ==================== CONTENT MANAGEMENT TYPES ====================

export interface TestimonialItem {
  id?: string
  clientName: string
  clientPhoto?: string
  clientTitle?: string
  content: string
  rating: number
  serviceName?: string
  createdAt?: string
  updatedAt?: string
}

export interface FAQItem {
  id?: string
  question: string
  answer: string
  category?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface AboutContent {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  imagePosition?: 'left' | 'right'
  highlights?: string[]
  founderName?: string
  founderPhoto?: string
  founderTitle?: string
  founderQuote?: string
  showTeamStats?: boolean
}

export interface GalleryImageItem {
  id?: string
  url: string
  caption?: string
  category?: string
  serviceName?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface StorefrontContent {
  testimonials: TestimonialItem[]
  faqs: FAQItem[]
  about: AboutContent
  gallery: GalleryImageItem[]
}
