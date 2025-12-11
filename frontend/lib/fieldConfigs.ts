// Field configurations for each category
// This ensures consistency across submit, update, and detail pages

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'location';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  step?: string;
  min?: number;
  helpText?: string;
  conditional?: {
    field: string;
    value: any;
  };
}

export const categoryFieldConfigs: { [key: string]: FieldConfig[] } = {
  products: [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter product name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the product...' },
    { name: 'price', label: 'Price (BDT)', type: 'number', step: '0.01', placeholder: '0.00' },
    { name: 'barcode', label: 'Barcode', type: 'text', placeholder: 'Product barcode' },
  ],
  
  technicians: [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter technician name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the technician...' },
    { 
      name: 'technician_type', 
      label: 'Technician Type', 
      type: 'select', 
      options: ['', 'Plumber', 'Electrician', 'AC Technician', 'Programmer', 'Web Developer', 'Mobile App Developer', 'Video Editor', 'Graphic Designer', 'Photographer', 'Carpenter', 'Mechanic', 'Painter', 'Tailor', 'Other'] 
    },
    { name: 'hourly_rate', label: 'Hourly Rate (BDT)', type: 'number', step: '0.01', placeholder: '0.00' },
    { name: 'specialized_fields', label: 'Specialized Fields (comma-separated)', type: 'text', placeholder: 'e.g., React, Node.js, Laravel, Python', helpText: 'Separate multiple fields with commas' },
    { name: 'portfolio_link', label: 'Portfolio Link', type: 'url', placeholder: 'https://portfolio.example.com' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+880...' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { name: 'website', label: 'Website', type: 'url', placeholder: 'https://...' },
  ],
  
  shops: [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter shop name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the shop...' },
    { 
      name: 'shop_type', 
      label: 'Shop Type', 
      type: 'select', 
      options: ['', 'Cosmetics', 'Meat Shop', 'Electronics', 'Grocery', 'Pharmacy', 'Clothing', 'Footwear', 'Furniture', 'Stationery', 'Bookstore', 'Jewelry', 'Hardware', 'Mobile & Accessories', 'Computer & IT', 'Sports & Fitness', 'Toys & Games', 'Home & Kitchen', 'Beauty & Personal Care', 'Pet Supplies', 'Automotive', 'Gift Shop', 'Convenience Store', 'Supermarket', 'Department Store', 'Other'] 
    },
    { name: 'payment_types', label: 'Payment Types (comma-separated)', type: 'text', placeholder: 'e.g., Cash, bKash, Nagad, Card, Mobile Banking', helpText: 'Separate multiple payment types with commas' },
    { name: 'does_delivery', label: 'Does Delivery', type: 'checkbox' },
    { name: 'branches', label: 'Branches (one per line)', type: 'textarea', placeholder: 'Branch 1 Address\nBranch 2 Address', helpText: 'Enter one branch address per line' },
    { name: 'famous_for', label: 'Famous For', type: 'textarea', placeholder: 'What is this shop famous for? e.g., Best prices, Quality products, Fast delivery' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+880...' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { name: 'website', label: 'Website', type: 'url', placeholder: 'https://...' },
  ],
  
  universities: [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter university name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the university...' },
    { name: 'help_desk_phone', label: 'Help Desk / Information Desk Phone', type: 'tel', placeholder: '+880...' },
    { name: 'admission_office_phone', label: 'Admission Office Phone', type: 'tel', placeholder: '+880...' },
    { name: 'courses_offered', label: 'Courses/Programs (one per line)', type: 'textarea', placeholder: 'Computer Science\nElectrical Engineering', helpText: 'Enter one course per line' },
    { name: 'famous_for_courses', label: 'Famous/Best For Courses (comma-separated)', type: 'text', placeholder: 'e.g., Computer Science, Engineering, Business', helpText: 'Separate multiple courses with commas' },
    { 
      name: 'university_grade', 
      label: 'University Grade', 
      type: 'select', 
      options: ['', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'] 
    },
    { name: 'organization', label: 'Organization', type: 'text', placeholder: 'University organization/affiliation' },
    { name: 'total_faculty', label: 'Total Faculty', type: 'number', placeholder: 'Number of faculty members', min: 0 },
    { name: 'vice_chancellor', label: 'Vice Chancellor / CEO', type: 'text', placeholder: 'Name of Vice Chancellor' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { name: 'website', label: 'Website', type: 'url', placeholder: 'https://...' },
  ],
  
  websites: [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter website name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the website...' },
    { name: 'url', label: 'Website URL', type: 'url', required: true, placeholder: 'https://...' },
    { 
      name: 'website_type', 
      label: 'Website Type', 
      type: 'select', 
      options: ['', 'E-commerce', 'News', 'Education', 'Government', 'Social Media', 'Entertainment', 'Business', 'Service', 'Other'] 
    },
    { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Organization name' },
    { name: 'total_employees', label: 'Total Employees', type: 'number', placeholder: 'Number of employees', min: 0 },
    { name: 'delivery_rate', label: 'Delivery Rate (BDT)', type: 'number', step: '0.01', placeholder: '0.00' },
    { name: 'office_time', label: 'Office Time', type: 'text', placeholder: 'e.g., 9 AM - 6 PM, Sat-Thu' },
    { name: 'payment_methods', label: 'Payment Methods (comma-separated)', type: 'text', placeholder: 'bKash, Nagad, Card, Cash on Delivery', helpText: 'Separate multiple methods with commas' },
    { name: 'other_domains', label: 'Other Domains (one per line)', type: 'textarea', placeholder: 'https://example.com', helpText: 'Enter one domain per line' },
    { name: 'has_physical_store', label: 'Has Physical Store', type: 'checkbox' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+880...' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
  ],
};

// Common location fields (used by most categories)
export const locationFields: FieldConfig[] = [
  { name: 'division', label: 'Division', type: 'select', options: ['', 'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'] },
  { name: 'district', label: 'District', type: 'text', placeholder: 'District' },
  { name: 'area', label: 'Area', type: 'text', placeholder: 'Area/Locality' },
  { name: 'address', label: 'Full Address', type: 'textarea', placeholder: 'Complete address...' },
];

// Get all fields for a category including location
export function getCategoryFields(categorySlug: string): FieldConfig[] {
  const categoryFields = categoryFieldConfigs[categorySlug] || [];
  const needsLocation = !['websites'].includes(categorySlug);
  
  if (needsLocation) {
    return [...categoryFields, ...locationFields];
  }
  
  return categoryFields;
}

