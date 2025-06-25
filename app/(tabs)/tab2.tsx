import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { authService } from '@/services/authService';
import { User as UserType } from '@/types';
import { Chrome as Home, Users, Heart, FileText, User, DollarSign } from 'lucide-react-native';
import CasesScreen from '../screens/cases';
import NGOsScreen from '../screens/ngos';
import NewRequestScreen from '../screens/new-request';
import RequestsScreen from '../screens/requests';

const tab2 = () => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) return null;

  const getTabsForRole = () => {

    const roleTabs = {
      donor: [
        {
          name: 'ngos',
          title: 'NGOs',
          icon: Users,
        },
        {
          name: 'victims',
          title: 'Help Needed',
          icon: Heart,
        },
      ],
      victim: [
        {
          name: 'new-request',
          title: 'New Request',
          icon: FileText,
        },
        {
          name: 'my-requests',
          title: 'My Requests',
          icon: FileText,
        },
      ],
      consultant: [
        {
          name: 'requests',
          title: 'Requests',
          icon: FileText,
        },
        {
          name: 'schedule',
          title: 'Schedule',
          icon: FileText,
        },
      ],
      ngo: [
        {
          name: 'cases',
          title: 'Cases',
          icon: FileText,
        },
        {
          name: 'consultants',
          title: 'Consultants',
          icon: Users,
        },
      ],
    };

    return [ ...(roleTabs[user.role] || [])];
  };

  const tabs = getTabsForRole();
  console.log('tabs', JSON.stringify(tabs, null, 2))

 if(tabs[0]?.name == 'cases'){
  return(
    <CasesScreen />
  )
 }
 if(tabs[0]?.name == 'ngos'){
  return(
    <NGOsScreen />
  )
 }
 if(tabs[0]?.name == 'new-request'){
  return(
    <NewRequestScreen />
  )
 }
 if(tabs[0]?.name == 'requests'){
  return(
    <RequestsScreen />
  )
 }
  return (
    <View>
    </View>
  )
}

export default tab2