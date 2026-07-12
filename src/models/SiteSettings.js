import mongoose from 'mongoose';

const TranslatedString = {
  en: { type: String, default: '' },
  hi: { type: String, default: '' },
  gu: { type: String, default: '' }
};

const TranslatedHtml = {
  en: { type: String, default: '' },
  hi: { type: String, default: '' },
  gu: { type: String, default: '' }
};

const SiteSettingsSchema = new mongoose.Schema(
  {
    // Singleton document - always _id "site"
    _id: { type: String, default: 'site' },

    // Branding
    siteName: { type: String, default: 'Jay Durga Jyotish' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },

    // Contact info - editable links shown across the site (header, footer, contact page)
    contact: {
      phone: { type: String, default: '+91 94268 93180' },
      whatsappNumber: { type: String, default: '919426893180' }, // digits only with country code
      email: { type: String, default: 'yashguruji10@gmail.com' },
      address: TranslatedString,
      mapEmbedUrl: { type: String, default: '' }
    },

    // Social media links
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },

    // Home page hero/banner content
    home: {
      heroTitle: TranslatedString,
      heroSubtitle: TranslatedString,
      heroImage: { type: String, default: '' },
      heroSlides: [
        {
          image: { type: String, default: '' },
          caption: TranslatedString
        }
      ],
      aboutShort: TranslatedHtml,
      astrologerSection: {
        title: TranslatedString,
        subtitle: TranslatedString,
        image: { type: String, default: '' },
        content: TranslatedHtml
      },
      // Office / branch locations shown in the "Our Locations" section
      branches: [
        {
          name: TranslatedString,
          address: TranslatedString,
          mapEmbedUrl: { type: String, default: '' }
        }
      ]
    },

    // About Us page
    aboutPage: {
      title: TranslatedString,
      content: TranslatedHtml,
      image: { type: String, default: '' }
    },

    // Country landing pages (USA / Canada / UK) - shown in the main nav and footer
    countryPages: {
      usa: {
        enabled: { type: Boolean, default: true },
        title: TranslatedString,
        content: TranslatedHtml,
        image: { type: String, default: '' }
      },
      canada: {
        enabled: { type: Boolean, default: true },
        title: TranslatedString,
        content: TranslatedHtml,
        image: { type: String, default: '' }
      },
      uk: {
        enabled: { type: Boolean, default: true },
        title: TranslatedString,
        content: TranslatedHtml,
        image: { type: String, default: '' }
      }
    },

    // Terms & Conditions page
    termsPage: {
      title: TranslatedString,
      content: TranslatedHtml
    },

    // Privacy Policy page
    privacyPage: {
      title: TranslatedString,
      content: TranslatedHtml
    },

    // Footer text
    footerText: TranslatedString
  },
  { timestamps: true, _id: false }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
