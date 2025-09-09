import React from 'react';

export function SearchResultSkeleton() {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-3 bg-gray-300 rounded w-20"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <div className="h-8 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function MediaThumbnailSkeleton() {
  return (
    <div className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse"></div>
  );
}

export function VehicleModelSkeleton() {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-6 animate-pulse mb-6">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gray-300"></div>
          <div>
            <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 bg-gray-300 rounded w-16"></div>
          <div className="h-8 bg-gray-300 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
}

export function FilterPanelSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
        <div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocumentDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content sections */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
      
      {/* Media gallery */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-40"></div>
        <div className="flex gap-4">
          <div className="w-64 h-32 bg-gray-300 rounded-lg"></div>
          <div className="w-64 h-32 bg-gray-300 rounded-lg"></div>
          <div className="w-64 h-32 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default {
  SearchResultSkeleton,
  MediaThumbnailSkeleton,
  VehicleModelSkeleton,
  FilterPanelSkeleton,
  DocumentDetailSkeleton
};