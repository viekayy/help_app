import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Chrome as Home, Users, Heart, FileText, User, DollarSign } from 'lucide-react-native';
import { authService } from '@/services/authService';
import { User as UserType } from '@/types';

export default function TabLayout() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) return null;

  const getTabsForRole = () => {
    const commonTabs = [
      {
        name: 'index',
        title: 'Home',
        icon: Home,
      },
      {
        name: 'profile',
        title: 'Profile',
        icon: User,
      },
    ];

    const roleTabs = {
      donor: [
        {
          name: 'tab2',
          title: 'NGOs',
          icon: Users,
        },
        {
          name: 'tab3',
          title: 'Help Needed',
          icon: Heart,
        },
      ],
      victim: [
        {
          name: 'tab2',
          title: 'New Request',
          icon: FileText,
        },
        {
          name: 'tab3',
          title: 'My Requests',
          icon: FileText,
        },
      ],
      consultant: [
        {
          name: 'tab2',
          title: 'Requests',
          icon: FileText,
        },
        {
          name: 'tab3',
          title: 'Schedule',
          icon: FileText,
        },
      ],
      ngo: [
        {
          name: 'tab2',
          title: 'Cases',
          icon: FileText,
        },
        {
          name: 'tab3',
          title: 'Consultants',
          icon: Users,
        },
      ],
    };

    return [commonTabs[0], ...(roleTabs[user.role] || []), commonTabs[1]];
    // return [commonTabs[0], ...(roleTabs["donor"] || []), commonTabs[1]];
  };

  const tabs = getTabsForRole();
  const tabsFinal = tabs.slice(0,4);
  console.log('vkTabs:', JSON.stringify(tabsFinal, null, 2));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      {tabsFinal.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <tab.icon size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}