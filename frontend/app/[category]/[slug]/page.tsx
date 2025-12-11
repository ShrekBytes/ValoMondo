'use client';

import { useEffect } from 'react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { categories } from '@/lib/api';
import { useParams } from 'next/navigation';
import ReviewSection from '@/components/ReviewSection';
import RatingDisplay from '@/components/RatingDisplay';
import RatingForm from '@/components/RatingForm';
import { useSession, getSession } from 'next-auth/react';
import Link from 'next/link';

export default function CategoryItemDetailPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const itemSlug = params.slug as string;
  const { data: session, status } = useSession();

  // Sync token to localStorage when session is available
  useEffect(() => {
    const syncToken = async () => {
      if (status === 'authenticated' && session?.user?.token) {
        localStorage.setItem('auth_token', session.user.token);
      } else if (status === 'loading') {
        // Try to get session if it's still loading
        const currentSession = await getSession();
        if (currentSession?.user?.token) {
          localStorage.setItem('auth_token', currentSession.user.token);
        }
      }
    };
    syncToken();
  }, [session, status]);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['categoryItem', categorySlug, itemSlug],
    queryFn: async () => {
      const response = await categories.getItemBySlug(categorySlug, itemSlug);
      // API Resource returns data directly, not wrapped
      return response.data.data || response.data;
    },
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors - item page should be public
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Map category slugs to model class names for polymorphic relationships
  const getModelClass = (categorySlug: string): string => {
    const categoryModelMap: { [key: string]: string } = {
      'products': 'App\\Models\\Product',
      'restaurants': 'App\\Models\\Restaurant',
      'shops': 'App\\Models\\Shop',
      'manufacturers': 'App\\Models\\Manufacturer',
      'schools': 'App\\Models\\School',
      'universities': 'App\\Models\\University',
      'hospitals': 'App\\Models\\Hospital',
      'hotels': 'App\\Models\\Hotel',
      'tourist-spots': 'App\\Models\\TouristSpot',
      'technicians': 'App\\Models\\Technician',
      'websites': 'App\\Models\\Website',
    };
    return categoryModelMap[categorySlug] || 'App\\Models\\Product';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error loading item</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Item not found</h1>
        </div>
      </div>
    );
  }

  const modelClass = getModelClass(categorySlug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Item Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div>
          {item.images && item.images.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={item.images[0].url}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Thumbnails */}
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(0, 4).map((image: any, index: number) => (
                    <div key={image.id} className="relative h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition">
                      <img
                        src={image.url}
                        alt={`${item.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{item.name}</h1>
            {session && (
              <Link
                href={`/${categorySlug}/${item.slug}/update`}
                className="btn btn-secondary text-sm"
              >
                📝 Update Info
              </Link>
            )}
          </div>
          
          {/* Rating Display */}
          <RatingDisplay
            avgRating={item.avg_user_rating || 0}
            totalRatings={item.total_ratings || 0}
            moderatorRating={item.moderator_rating}
          />

          {/* Category-Specific Fields - Matching Submit Page Order */}
          
          {/* Products */}
          {categorySlug === 'products' && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Product Details</h3>
              <div className="space-y-2">
                {item.price && (
                  <div>
                    <span className="text-sm text-gray-600">Price (BDT): </span>
                    <span className="text-2xl font-bold text-primary-600">
                      {item.price_currency || 'BDT'} {parseFloat(item.price).toLocaleString()}
                    </span>
                  </div>
                )}
                {item.barcode && (
                  <div>
                    <span className="text-sm text-gray-600">Barcode: </span>
                    <span className="font-medium">{item.barcode}</span>
                  </div>
                )}
                {item.manufacturer && (
                  <div>
                    <span className="text-sm text-gray-600">Manufacturer: </span>
                    <span className="font-medium">{item.manufacturer.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technicians */}
          {categorySlug === 'technicians' && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Technician Details</h3>
              <div className="space-y-2">
                {item.technician_type && (
                  <div>
                    <span className="text-sm text-gray-600">Technician Type: </span>
                    <span className="font-medium">{item.technician_type}</span>
                  </div>
                )}
                {item.hourly_rate && (
                  <div>
                    <span className="text-sm text-gray-600">Hourly Rate (BDT): </span>
                    <span className="font-medium">BDT {parseFloat(item.hourly_rate).toLocaleString()}</span>
                  </div>
                )}
                {item.specialized_fields && Array.isArray(item.specialized_fields) && item.specialized_fields.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Specialized Fields: </span>
                    <span className="font-medium">{item.specialized_fields.join(', ')}</span>
                  </div>
                )}
                {item.portfolio_link && (
                  <div>
                    <span className="text-sm text-gray-600">Portfolio Link: </span>
                    <a 
                      href={item.portfolio_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {item.portfolio_link}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shops */}
          {categorySlug === 'shops' && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Shop Details</h3>
              <div className="space-y-2">
                {item.shop_type && (
                  <div>
                    <span className="text-sm text-gray-600">Shop Type: </span>
                    <span className="font-medium">{item.shop_type}</span>
                  </div>
                )}
                {item.payment_types && Array.isArray(item.payment_types) && item.payment_types.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Payment Types: </span>
                    <span className="font-medium">{item.payment_types.join(', ')}</span>
                  </div>
                )}
                {item.does_delivery !== undefined && (
                  <div>
                    <span className="text-sm text-gray-600">Does Delivery: </span>
                    <span className="font-medium">{item.does_delivery ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {item.branches && Array.isArray(item.branches) && item.branches.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Branches: </span>
                    <ul className="list-disc list-inside mt-1">
                      {item.branches.map((branch: string, index: number) => (
                        <li key={index} className="font-medium">{branch}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.famous_for && (
                  <div>
                    <span className="text-sm text-gray-600">Famous For: </span>
                    <span className="font-medium">{item.famous_for}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Universities */}
          {categorySlug === 'universities' && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">University Details</h3>
              <div className="space-y-2">
                {item.help_desk_phone && (
                  <div>
                    <span className="text-sm text-gray-600">Help Desk / Information Desk Phone: </span>
                    <span className="font-medium">{item.help_desk_phone}</span>
                  </div>
                )}
                {item.admission_office_phone && (
                  <div>
                    <span className="text-sm text-gray-600">Admission Office Phone: </span>
                    <span className="font-medium">{item.admission_office_phone}</span>
                  </div>
                )}
                {(() => {
                  // Handle courses_offered - could be array, JSON string, or null
                  let courses: string[] = [];
                  if (item.courses_offered) {
                    if (Array.isArray(item.courses_offered)) {
                      // If it's an array, flatten it and handle comma-separated strings
                      courses = item.courses_offered
                        .flatMap((c: any) => {
                          if (!c) return [];
                          const str = String(c).trim();
                          if (str === '') return [];
                          // If the string contains commas, split it
                          if (str.includes(',')) {
                            return str.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
                          }
                          return [str];
                        })
                        .filter((c: string) => c && c.trim() !== '');
                    } else if (typeof item.courses_offered === 'string') {
                      try {
                        const parsed = JSON.parse(item.courses_offered);
                        if (Array.isArray(parsed)) {
                          courses = parsed
                            .flatMap((c: any) => {
                              if (!c) return [];
                              const str = String(c).trim();
                              if (str === '') return [];
                              // If the string contains commas, split it
                              if (str.includes(',')) {
                                return str.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
                              }
                              return [str];
                            })
                            .filter((c: string) => c && c.trim() !== '');
                        }
                      } catch (e) {
                        // If not JSON, treat as single value or comma-separated
                        const str = item.courses_offered.trim();
                        if (str !== '') {
                          if (str.includes(',')) {
                            courses = str.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
                          } else {
                            courses = [str];
                          }
                        }
                      }
                    }
                  }
                  
                  return courses.length > 0 ? (
                    <div>
                      <span className="text-sm text-gray-600">Courses/Programs: </span>
                      <ul className="list-disc list-inside mt-1">
                        {courses.map((course: string, index: number) => (
                          <li key={index} className="font-medium">{course}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  // Handle famous_for_courses - could be array, JSON string, or null
                  let famousCourses: string[] = [];
                  if (item.famous_for_courses) {
                    if (Array.isArray(item.famous_for_courses)) {
                      // If it's an array, flatten it and handle comma-separated strings
                      famousCourses = item.famous_for_courses
                        .flatMap((c: any) => {
                          if (!c) return [];
                          const str = String(c).trim();
                          if (str === '') return [];
                          // If the string contains commas, split it
                          if (str.includes(',')) {
                            return str.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
                          }
                          return [str];
                        })
                        .filter((c: string) => c && c.trim() !== '');
                    } else if (typeof item.famous_for_courses === 'string') {
                      try {
                        const parsed = JSON.parse(item.famous_for_courses);
                        if (Array.isArray(parsed)) {
                          famousCourses = parsed
                            .flatMap((c: any) => {
                              if (!c) return [];
                              const str = String(c).trim();
                              if (str === '') return [];
                              // If the string contains commas, split it
                              if (str.includes(',')) {
                                return str.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
                              }
                              return [str];
                            })
                            .filter((c: string) => c && c.trim() !== '');
                        }
                      } catch (e) {
                        // If not JSON, treat as single value or comma-separated
                        const str = item.famous_for_courses.trim();
                        if (str !== '') {
                          if (str.includes(',')) {
                            famousCourses = str.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
                          } else {
                            famousCourses = [str];
                          }
                        }
                      }
                    }
                  }
                  
                  return famousCourses.length > 0 ? (
                    <div>
                      <span className="text-sm text-gray-600">Famous/Best For Courses: </span>
                      <span className="font-medium">{famousCourses.join(', ')}</span>
                    </div>
                  ) : null;
                })()}
                {item.university_grade && (
                  <div>
                    <span className="text-sm text-gray-600">University Grade: </span>
                    <span className="font-medium">{item.university_grade}</span>
                  </div>
                )}
                {item.organization && (
                  <div>
                    <span className="text-sm text-gray-600">Organization: </span>
                    <span className="font-medium">{item.organization}</span>
                  </div>
                )}
                {item.total_faculty && (
                  <div>
                    <span className="text-sm text-gray-600">Total Faculty: </span>
                    <span className="font-medium">{item.total_faculty}</span>
                  </div>
                )}
                {item.vice_chancellor && (
                  <div>
                    <span className="text-sm text-gray-600">Vice Chancellor / CEO: </span>
                    <span className="font-medium">{item.vice_chancellor}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Websites */}
          {categorySlug === 'websites' && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Website Details</h3>
              <div className="space-y-2">
                {item.url && (
                  <div>
                    <span className="text-sm text-gray-600">Website URL: </span>
                    <a 
                      href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {item.url}
                    </a>
                  </div>
                )}
                {item.website_type && (
                  <div>
                    <span className="text-sm text-gray-600">Website Type: </span>
                    <span className="font-medium">{item.website_type}</span>
                  </div>
                )}
                {item.organization && (
                  <div>
                    <span className="text-sm text-gray-600">Organization: </span>
                    <span className="font-medium">{item.organization}</span>
                  </div>
                )}
                {item.total_employees && (
                  <div>
                    <span className="text-sm text-gray-600">Total Employees: </span>
                    <span className="font-medium">{item.total_employees}</span>
                  </div>
                )}
                {item.delivery_rate && (
                  <div>
                    <span className="text-sm text-gray-600">Delivery Rate (BDT): </span>
                    <span className="font-medium">BDT {parseFloat(item.delivery_rate).toLocaleString()}</span>
                  </div>
                )}
                {item.office_time && (
                  <div>
                    <span className="text-sm text-gray-600">Office Time: </span>
                    <span className="font-medium">{item.office_time}</span>
                  </div>
                )}
                {item.payment_methods && Array.isArray(item.payment_methods) && item.payment_methods.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Payment Methods: </span>
                    <span className="font-medium">{item.payment_methods.join(', ')}</span>
                  </div>
                )}
                {item.other_domains && Array.isArray(item.other_domains) && item.other_domains.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Other Domains: </span>
                    <ul className="list-disc list-inside mt-1">
                      {item.other_domains.map((domain: string, index: number) => (
                        <li key={index}>
                          <a 
                            href={domain.startsWith('http') ? domain : `https://${domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline"
                          >
                            {domain}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.has_physical_store !== undefined && (
                  <div>
                    <span className="text-sm text-gray-600">Has Physical Store: </span>
                    <span className="font-medium">{item.has_physical_store ? 'Yes' : 'No'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location Information - Matching Submit Page Order (before Contact) */}
          {categorySlug !== 'websites' && (() => {
            // Helper function to safely check if a value exists and is not empty
            const hasValue = (val: any): boolean => {
              return val !== null && val !== undefined && String(val).trim() !== '';
            };
            
            // Check if any location field exists
            const hasLocation = hasValue(item.address) || 
                                hasValue(item.area) || 
                                hasValue(item.district) || 
                                hasValue(item.division);
            
            if (!hasLocation) return null;
            
            return (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Location</h3>
                <div className="space-y-2">
                  {hasValue(item.division) && (
                    <div>
                      <span className="text-sm text-gray-600">Division: </span>
                      <span className="font-medium">{item.division}</span>
                    </div>
                  )}
                  {hasValue(item.district) && (
                    <div>
                      <span className="text-sm text-gray-600">District: </span>
                      <span className="font-medium">{item.district}</span>
                    </div>
                  )}
                  {hasValue(item.area) && (
                    <div>
                      <span className="text-sm text-gray-600">Area: </span>
                      <span className="font-medium">{item.area}</span>
                    </div>
                  )}
                  {hasValue(item.address) && (
                    <div>
                      <span className="text-sm text-gray-600">Full Address: </span>
                      <span className="font-medium">{item.address}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Physical Location for Websites (only if has_physical_store) */}
          {categorySlug === 'websites' && item.has_physical_store && (() => {
            const hasLocation = (item.address && item.address.trim() !== '') || 
                                (item.area && item.area.trim() !== '') || 
                                (item.district && item.district.trim() !== '') || 
                                (item.division && item.division.trim() !== '');
            
            if (!hasLocation) return null;
            
            return (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-semibold text-md mb-3">Physical Location</h4>
                <div className="space-y-2">
                  {item.division && item.division.trim() !== '' && (
                    <div>
                      <span className="text-sm text-gray-600">Division: </span>
                      <span className="font-medium">{item.division}</span>
                    </div>
                  )}
                  {item.district && item.district.trim() !== '' && (
                    <div>
                      <span className="text-sm text-gray-600">District: </span>
                      <span className="font-medium">{item.district}</span>
                    </div>
                  )}
                  {item.area && item.area.trim() !== '' && (
                    <div>
                      <span className="text-sm text-gray-600">Area: </span>
                      <span className="font-medium">{item.area}</span>
                    </div>
                  )}
                  {item.address && item.address.trim() !== '' && (
                    <div>
                      <span className="text-sm text-gray-600">Full Address: </span>
                      <span className="font-medium">{item.address}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Contact Information - Matching Submit Page Order (after Location) */}
          {/* Contact for Technicians and Shops */}
          {['technicians', 'shops'].includes(categorySlug) && (() => {
            // Helper function to safely check if a value exists and is not empty
            const hasValue = (val: any): boolean => {
              return val !== null && val !== undefined && String(val).trim() !== '';
            };
            
            // Check if any contact field exists
            const hasContact = hasValue(item.phone) || 
                                hasValue(item.email) || 
                                hasValue(item.website);
            
            if (!hasContact) return null;
            
            return (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {hasValue(item.phone) && (
                    <div>
                      <span className="text-sm text-gray-600">Phone: </span>
                      <span className="font-medium">{item.phone}</span>
                    </div>
                  )}
                  {hasValue(item.email) && (
                    <div>
                      <span className="text-sm text-gray-600">Email: </span>
                      <a href={`mailto:${item.email}`} className="text-primary-600 hover:underline">
                        {item.email}
                      </a>
                    </div>
                  )}
                  {hasValue(item.website) && (
                    <div>
                      <span className="text-sm text-gray-600">Website: </span>
                      <a 
                        href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {item.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Contact for Universities */}
          {categorySlug === 'universities' && (() => {
            // Helper function to safely check if a value exists and is not empty
            const hasValue = (val: any): boolean => {
              return val !== null && val !== undefined && String(val).trim() !== '';
            };
            
            // Check if any contact field exists
            const hasContact = hasValue(item.email) || 
                                hasValue(item.website);
            
            if (!hasContact) return null;
            
            return (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {hasValue(item.email) && (
                    <div>
                      <span className="text-sm text-gray-600">Email: </span>
                      <a href={`mailto:${item.email}`} className="text-primary-600 hover:underline">
                        {item.email}
                      </a>
                    </div>
                  )}
                  {hasValue(item.website) && (
                    <div>
                      <span className="text-sm text-gray-600">Website: </span>
                      <a 
                        href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {item.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Contact for Websites */}
          {categorySlug === 'websites' && (() => {
            const hasContact = (item.phone && item.phone.trim() !== '') || 
                                (item.email && item.email.trim() !== '');
            
            if (!hasContact) return null;
            
            return (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {item.phone && item.phone.trim() !== '' && (
                    <div>
                      <span className="text-sm text-gray-600">Phone: </span>
                      <span className="font-medium">{item.phone}</span>
                    </div>
                  )}
                  {item.email && item.email.trim() !== '' && (
                    <div>
                      <span className="text-sm text-gray-600">Email: </span>
                      <a href={`mailto:${item.email}`} className="text-primary-600 hover:underline">
                        {item.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Description */}
          {item.description && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          )}

          {/* User Rating Form */}
          {session && (
            <div className="mt-8">
              <RatingForm
                ratableType={modelClass}
                ratableId={item.id}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection
        reviewableType={modelClass}
        reviewableId={item.id}
      />
    </div>
  );
}
