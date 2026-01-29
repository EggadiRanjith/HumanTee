/**
 * Contact Page Metadata
 * SEO optimization for contact page
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | HumanTee',
    description: 'Get in touch with HumanTee. We respond within 24 hours. Email us at humanteeteam@gmail.com or fill out our contact form.',
    keywords: ['contact humantee', 'customer support', 'email support', 'contact form'],
    openGraph: {
        title: 'Contact Us | HumanTee',
        description: 'Get in touch with HumanTee. We respond within 24 hours.',
        type: 'website',
        url: 'https://www.humantee.in/contact',
    },
    twitter: {
        card: 'summary',
        title: 'Contact Us | HumanTee',
        description: 'Get in touch with HumanTee. We respond within 24 hours.',
    },
    alternates: {
        canonical: 'https://www.humantee.in/contact',
    },
};
