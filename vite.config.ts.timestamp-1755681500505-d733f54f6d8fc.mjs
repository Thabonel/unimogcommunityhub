// vite.config.ts
import { defineConfig } from "file:///Users/thabonel/Documents/unimogcommunityhub/node_modules/vite/dist/node/index.js";
import react from "file:///Users/thabonel/Documents/unimogcommunityhub/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/thabonel/Documents/unimogcommunityhub";
var vite_config_default = defineConfig(({ mode }) => ({
  publicDir: "public",
  server: {
    host: "localhost",
    port: 5173,
    cors: {
      origin: "*",
      // Allow all origins
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    }
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  define: {
    "process.env": {}
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select", "@radix-ui/react-toast"],
          "supabase": ["@supabase/supabase-js"],
          "map": ["mapbox-gl"],
          "i18n": ["i18next", "react-i18next"],
          "utils": ["date-fns", "clsx", "tailwind-merge"]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1e3,
    // Enable source maps for production debugging
    sourcemap: mode === "production"
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "mapbox-gl"
    ],
    exclude: [
      // Exclude packages that have issues with bundling
      "langchain",
      "@langchain/core",
      "@langchain/community",
      "@browserbasehq/stagehand"
    ]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdGhhYm9uZWwvRG9jdW1lbnRzL3VuaW1vZ2NvbW11bml0eWh1YlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3RoYWJvbmVsL0RvY3VtZW50cy91bmltb2djb21tdW5pdHlodWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3RoYWJvbmVsL0RvY3VtZW50cy91bmltb2djb21tdW5pdHlodWIvdml0ZS5jb25maWcudHNcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHB1YmxpY0RpcjogJ3B1YmxpYycsXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4gICAgcG9ydDogNTE3MyxcbiAgICBjb3JzOiB7XG4gICAgICBvcmlnaW46IFwiKlwiLCAvLyBBbGxvdyBhbGwgb3JpZ2luc1xuICAgICAgbWV0aG9kczogW1wiR0VUXCIsIFwiUE9TVFwiLCBcIlBVVFwiLCBcIkRFTEVURVwiLCBcIk9QVElPTlNcIl0sXG4gICAgICBhbGxvd2VkSGVhZGVyczogW1wiQ29udGVudC1UeXBlXCIsIFwiQXV0aG9yaXphdGlvblwiXSxcbiAgICAgIGNyZWRlbnRpYWxzOiB0cnVlXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Jzoge31cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyBFbmFibGUgY29kZSBzcGxpdHRpbmdcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gTWFudWFsIGNodW5rcyBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgLy8gVmVuZG9yIGNodW5rc1xuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgJ3VpLXZlbmRvcic6IFsnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JywgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCddLFxuICAgICAgICAgICdzdXBhYmFzZSc6IFsnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ10sXG4gICAgICAgICAgJ21hcCc6IFsnbWFwYm94LWdsJ10sXG4gICAgICAgICAgJ2kxOG4nOiBbJ2kxOG5leHQnLCAncmVhY3QtaTE4bmV4dCddLFxuICAgICAgICAgICd1dGlscyc6IFsnZGF0ZS1mbnMnLCAnY2xzeCcsICd0YWlsd2luZC1tZXJnZSddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIE9wdGltaXplIGNodW5rIHNpemVcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gICAgLy8gRW5hYmxlIHNvdXJjZSBtYXBzIGZvciBwcm9kdWN0aW9uIGRlYnVnZ2luZ1xuICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLFxuICB9LFxuICAvLyBPcHRpbWl6ZSBkZXBlbmRlbmNpZXNcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcycsXG4gICAgICAnbWFwYm94LWdsJyxcbiAgICBdLFxuICAgIGV4Y2x1ZGU6IFtcbiAgICAgIC8vIEV4Y2x1ZGUgcGFja2FnZXMgdGhhdCBoYXZlIGlzc3VlcyB3aXRoIGJ1bmRsaW5nXG4gICAgICAnbGFuZ2NoYWluJyxcbiAgICAgICdAbGFuZ2NoYWluL2NvcmUnLFxuICAgICAgJ0BsYW5nY2hhaW4vY29tbXVuaXR5JyxcbiAgICAgICdAYnJvd3NlcmJhc2VocS9zdGFnZWhhbmQnXG4gICAgXSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLE1BQ0osUUFBUTtBQUFBO0FBQUEsTUFDUixTQUFTLENBQUMsT0FBTyxRQUFRLE9BQU8sVUFBVSxTQUFTO0FBQUEsTUFDbkQsZ0JBQWdCLENBQUMsZ0JBQWdCLGVBQWU7QUFBQSxNQUNoRCxhQUFhO0FBQUEsSUFDZjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUEsSUFFTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQSxRQUVOLGNBQWM7QUFBQTtBQUFBLFVBRVosZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGFBQWEsQ0FBQywwQkFBMEIsaUNBQWlDLDBCQUEwQix1QkFBdUI7QUFBQSxVQUMxSCxZQUFZLENBQUMsdUJBQXVCO0FBQUEsVUFDcEMsT0FBTyxDQUFDLFdBQVc7QUFBQSxVQUNuQixRQUFRLENBQUMsV0FBVyxlQUFlO0FBQUEsVUFDbkMsU0FBUyxDQUFDLFlBQVksUUFBUSxnQkFBZ0I7QUFBQSxRQUNoRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLHVCQUF1QjtBQUFBO0FBQUEsSUFFdkIsV0FBVyxTQUFTO0FBQUEsRUFDdEI7QUFBQTtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBO0FBQUEsTUFFUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
