import { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import { getBrandBookingsByBrandId, getBrandById } from '../../services/brandService';
import { getCreatorBookingsByCreatorId, getCreatorById } from '../../services/creator.service';
import type { BookingItem, Creator } from '../../Types/Creator';
import { getMediaByCreator } from '../../services/ImagesService';
import type { Brand } from '../../entities/Brand';
import LeftPanel from './LeftPanel';
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';
import { useOrdersLogic } from './useOrdersLogic';

export default function OrdersPage() {
  const [items, setItems] = useState<BookingItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<BookingItem[]>([]);
  const [, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [serviceNames, setServiceNames] = useState<{ [key: number]: string }>({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [mediaMap, setMediaMap] = useState<{ [creatorId: number]: string }>({});
  const [logoMap, setLogoMap] = useState<{ [brandId: number]: string }>({});

  const [buttonStates, setButtonStates] = useState<{
    [key: string]: 'default' | 'confirm-accept' | 'confirm-decline' | 'accepted';
  }>({});

  const {
    handleCreatorClick,
    handleBrandClick,
    handleButtonClick,
    handleCompleteClick,
    getOtherUser,
    getFilteredOrders,
  } = useOrdersLogic({
    items,
    setItems,
    selectedCreator,
    setSelectedCreator,
    selectedBrand,
    setSelectedBrand,
    selectedOrders,
    setSelectedOrders,
    buttonStates,
    setButtonStates,
    tabValue,
    user,
  });
  const [revisionMessage, setRevisionMessage] = useState<string | null>(null);

  // Helper function to get filtered items by status
  const getItemsByStatus = (status: string) => {
    return items.filter((item) => item.status === status);
  };

  useEffect(() => {
    async function fetchItems() {
      try {
        let data: BookingItem[] = [];
        if (user.role === 'brand') {
          data = await getBrandBookingsByBrandId(Number(user.id));
          setItems(data || []);
          // Get unique creator IDs
          const creatorIds = [
            ...new Set(
              data.map(
                (item: { creatorService: { creatorId: number } }) => item.creatorService.creatorId,
              ),
            ),
          ];
          // Fetch all creators
          const creatorsData = await Promise.all(
            creatorIds.map(async (id) => {
              const creator = await getCreatorById(Number(id));
              return creator;
            }),
          );

          setCreators(creatorsData);

          // Set the first order from the current tab as selected by default
          const currentStatusItems = getItemsByStatus(
            tabValue === 0 ? 'Requested' : tabValue === 1 ? 'In Progress' : 'Completed',
          );

          if (currentStatusItems.length > 0) {
            const firstOrder = currentStatusItems[0];
            const creator = creatorsData.find((c) => c.id === firstOrder.creatorService.creatorId);
            if (creator) {
              setSelectedCreator(creator);
              setSelectedOrders([firstOrder]);
            }
          }
        } else if (user.role === 'creator') {
          data = await getCreatorBookingsByCreatorId(Number(user.id));
          setItems(data || []);
          const brandIds = [...new Set(data.map((item: BookingItem) => item.booking.brandId))];
          // Fetch all brands
          const brandsData = await Promise.all(
            brandIds.map(async (id) => {
              const brand = await getBrandById(Number(id));
              return brand;
            }),
          );

          setBrands(brandsData);

          // Set the first order from the current tab as selected by default
          const currentStatusItems = getItemsByStatus(
            tabValue === 0 ? 'Requested' : tabValue === 1 ? 'In Progress' : 'Completed',
          );

          if (currentStatusItems.length > 0) {
            const firstOrder = currentStatusItems[0];
            const brand = brandsData.find((b) => b.id === firstOrder.booking.brandId);
            if (brand) {
              setSelectedBrand(brand);
              setSelectedOrders([firstOrder]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching booking items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [user.id, tabValue]); // Added tabValue dependency to reselect on tab change

  useEffect(() => {
    async function fetchMedia() {
      if (!items.length) return;

      try {
        const newMediaMap: Record<number, string> = {};

        for (const order of items) {
          const creatorId = order.creatorService?.creatorId;
          if (!creatorId) continue;

          const media = await getMediaByCreator(creatorId);
          const profile = media.find((m) => m.type === 'PROFILE_PICTURE');
          newMediaMap[creatorId] = profile?.url ?? 'https://example.com/default-profile.jpg';
        }

        setMediaMap((prev) => ({ ...prev, ...newMediaMap }));
      } catch (error) {
        console.error('Failed to fetch media', error);
      }
    }

    fetchMedia();
  }, [items]);

  useEffect(() => {
    async function fetchLogo() {
      if (!items.length) return;
      try {
        const newLogoMap: Record<number, string> = {};

        for (const order of items) {
          if (!order.booking) {
            console.warn('Skipping order with missing booking data:', order);
            continue;
          }
          const brandId = order.booking.brandId;
          if (!brandId) continue;
          const brand = await getBrandById(brandId);
          newLogoMap[brandId] = brand.logoUrl ?? 'https://example.com/default-logo.jpg';
        }
        setLogoMap((prev) => ({ ...prev, ...newLogoMap }));
      } catch (error) {
        console.error('Failed to fetch logos', error);
      }
    }
    fetchLogo();
  }, [items]);

  // Reset selection when tab changes
  useEffect(() => {
    const currentStatusItems = getItemsByStatus(
      tabValue === 0 ? 'Requested' : tabValue === 1 ? 'In Progress' : 'Completed',
    );

    if (currentStatusItems.length > 0) {
      const firstOrder = currentStatusItems[0];

      if (user.role === 'brand') {
        const creator = creators.find((c) => c.id === firstOrder.creatorService.creatorId);
        if (creator) {
          setSelectedCreator(creator);
          setSelectedOrders([firstOrder]);
        }
      } else if (user.role === 'creator') {
        const brand = brands.find((b) => b.id === firstOrder.booking.brandId);
        if (brand) {
          setSelectedBrand(brand);
          setSelectedOrders([firstOrder]);
        }
      }
    } else {
      // Clear selection if no orders in current tab
      setSelectedCreator(null);
      setSelectedBrand(null);
      setSelectedOrders([]);
    }
  }, [tabValue, items, creators, brands, user.role]);

  const otherUser = getOtherUser();
  const filteredOrders = getFilteredOrders();

  return (
    <>
      <Box>
        <Divider />
      </Box>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 85px)', bgcolor: 'grey.100', mt: '85px' }}>
        <LeftPanel
          user={user}
          tabValue={tabValue}
          setTabValue={setTabValue}
          creators={creators}
          brands={brands}
          items={items}
          selectedCreator={selectedCreator}
          selectedBrand={selectedBrand}
          mediaMap={mediaMap}
          logoMap={logoMap}
          onCreatorClick={handleCreatorClick}
          onBrandClick={handleBrandClick}
        />

        <MiddlePanel
          user={user}
          selectedCreator={selectedCreator}
          selectedBrand={selectedBrand}
          filteredOrders={filteredOrders}
          serviceNames={serviceNames}
          setServiceNames={setServiceNames}
          selectedOrders={selectedOrders}
          otherUser={otherUser}
          revisionMessage={revisionMessage}
        />

        <RightPanel
          user={user}
          filteredOrders={filteredOrders}
          selectedCreator={selectedCreator}
          selectedOrders={selectedOrders}
          serviceNames={serviceNames}
          buttonStates={buttonStates}
          otherUser={otherUser}
          onButtonClick={handleButtonClick}
          onCompleteClick={handleCompleteClick}
          onSendRevision={setRevisionMessage}
        />
      </Box>
    </>
  );
}
