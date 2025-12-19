import { redirect } from 'next/navigation';

/**
 * Admin Root Page
 * Redirects to orders (main operational view)
 */
export default function AdminRootPage() {
  redirect('/admin/orders');
}
