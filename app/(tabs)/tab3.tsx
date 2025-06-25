import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { authService } from '@/services/authService';
import { User as UserType } from '@/types';
import { Chrome as Home, Users, Heart, FileText, User, DollarSign } from 'lucide-react-native';
import CasesScreen from '../screens/cases';
import ConsultantsScreen from '../screens/consultants';
import VictimsScreen from '../screens/victims';
import MyRequestsScreen from '../screens/my-requests';
import ScheduleScreen from '../screens/schedule';

const tab3 = () => {
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
 if(tabs[1]?.name == 'consultants'){
  return(
    <ConsultantsScreen />
  )
 }
 if(tabs[1]?.name == 'victims'){
  return(
    <VictimsScreen />
  )
 }
 if(tabs[1]?.name == 'my-requests'){
  return(
    <MyRequestsScreen />
  )
 }
 if(tabs[1]?.name == 'schedule'){
  return(
    <ScheduleScreen />
  )
 }
  return (
    <View>
    </View>
  )
}

export default tab3