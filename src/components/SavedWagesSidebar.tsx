import { useEffect, useRef, useState } from 'react';
import { Bookmark, BriefcaseBusiness, Clock3, PanelLeftClose, PanelLeftOpen, Save, X } from 'lucide-react-native';
import { Box, Button, Icon, Label } from './ui';
import type { SavedWage } from '../hooks/useSavedWages';
import { calculateWages, formatMoney } from '../lib/calculator';
import { elementProps, useTheme, webClass, type Palette } from '../styles/theme';
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

type SavedWagesSidebarProps = {
  open: boolean;
  ready: boolean;
  docked: boolean;
  onClose: () => void;
  onToggle: () => void;
  entries: SavedWage[];
  selectedId: string | null;
  onRemove: (id: string) => void;
  onSelect: (entry: SavedWage) => void;
  storageStatus: `loading` | `saving` | `saved` | `unavailable`;
};

export const SAVED_WAGES_COLLAPSED_WIDTH = 56;
export const SAVED_WAGES_EXPANDED_WIDTH = 328;
const SAVED_WAGES_PANEL_WIDTH = SAVED_WAGES_EXPANDED_WIDTH - SAVED_WAGES_COLLAPSED_WIDTH;

const compactMoney = new Intl.NumberFormat(`en-US`, {
  style: `currency`,
  currency: `USD`,
  notation: `compact`,
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const periodSuffixes = {
  hourly: `/hr`,
  weekly: `/wk`,
  monthly: `/mo`,
  yearly: `/yr`,
};

export const SavedWagesSidebar = ({
  open,
  ready,
  docked,
  entries,
  onClose,
  onToggle,
  onSelect,
  onRemove,
  selectedId,
  storageStatus,
}: SavedWagesSidebarProps) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const styles = createStyles(colors);
  const [drawerMounted, setDrawerMounted] = useState(open);
  const [dockedMounted, setDockedMounted] = useState(open && docked);
  const drawerWidth = Math.min(SAVED_WAGES_EXPANDED_WIDTH, Math.max(SAVED_WAGES_COLLAPSED_WIDTH, width - 32));
  const offset = useRef(new Animated.Value(-drawerWidth)).current;
  const dockedWidth = useRef(new Animated.Value(
    open && docked ? SAVED_WAGES_EXPANDED_WIDTH : SAVED_WAGES_COLLAPSED_WIDTH,
  )).current;
  const status = storageStatus === `unavailable`
    ? `Device storage is unavailable. Wages stay in this session.`
    : storageStatus === `loading`
      ? `Loading saved wages…`
      : storageStatus === `saving`
        ? `Saving on this device…`
        : `Saved on this device`;

  useEffect(() => {
    dockedWidth.stopAnimation();
    if (!docked) {
      setDockedMounted(false);
      dockedWidth.setValue(SAVED_WAGES_COLLAPSED_WIDTH);
      return;
    }
    if (open) setDockedMounted(true);
    Animated.timing(dockedWidth, {
      duration: 260,
      toValue: open ? SAVED_WAGES_EXPANDED_WIDTH : SAVED_WAGES_COLLAPSED_WIDTH,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !open) setDockedMounted(false);
    });
  }, [open, docked, dockedWidth]);

  useEffect(() => {
    offset.stopAnimation();
    if (docked) {
      setDrawerMounted(false);
      offset.setValue(-drawerWidth);
      return;
    }
    if (open) setDrawerMounted(true);
    Animated.timing(offset, {
      duration: 220,
      toValue: open ? 0 : -drawerWidth,
      useNativeDriver: Platform.OS !== `web`,
    }).start(({ finished }) => {
      if (finished && !open) setDrawerMounted(false);
    });
  }, [open, docked, drawerWidth, offset]);

  const renderRail = (scope: string, expanded: boolean, hidden = false) => (
    <Box
      id={`saved-wages-${scope}-rail`}
      className={`saved-wages-rail`}
      style={styles.rail}
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? `no-hide-descendants` : `auto`}
    >
      <Button
        iconOnly
        iconSize={32}
        onPress={onToggle}
        variant={`ghost`}
        style={styles.railToggle}
        className={`saved-wages-rail-toggle`}
        id={`saved-wages-${scope}-rail-toggle`}
        accessibilityState={{ expanded }}
        disabled={hidden || !ready || entries.length === 0}
        icon={expanded ? PanelLeftClose : PanelLeftOpen}
        label={expanded ? `Collapse saved wages` : `Expand saved wages`}
      />
      {entries.length > 0 && (
        <Label
          style={styles.railCount}
          id={`saved-wages-${scope}-rail-count`}
          className={`saved-wages-rail-count`}
          accessibilityLabel={`${entries.length} saved wages`}
        >
          {entries.length}
        </Label>
      )}
    </Box>
  );

  const panel = (
    <Box
      id={`saved-wages-sidebar`}
      className={`saved-wages-sidebar`}
      style={[styles.sidebar, !docked && styles.drawerPanel]}
    >
      <Box id={`saved-wages-heading`} className={`saved-wages-heading`} style={styles.heading}>
        <Icon icon={Bookmark} size={19} id={`saved-wages-heading-icon`} className={`saved-wages-heading-icon`} />
        <Box id={`saved-wages-heading-copy`} className={`saved-wages-heading-copy`} style={styles.headingCopy}>
          <Label id={`saved-wages-title`} className={`saved-wages-title`} accessibilityRole={`header`} style={styles.title}>
            {`Saved wages`}
          </Label>
          <Label id={`saved-wages-subtitle`} className={`saved-wages-subtitle`} style={styles.caption}>
            {`Gross pay · ${entries.length} saved`}
          </Label>
        </Box>
      </Box>
      <ScrollView
        {...elementProps(`saved-wages-list`, `saved-wages-list`)}
        style={[styles.list, webClass(`saved-wages-list`)]}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps={`handled`}
      >
        {ready && entries.length === 0 && (
          <Box id={`saved-wages-empty`} className={`saved-wages-empty`} style={styles.empty}>
            <Icon icon={Save} size={28} id={`saved-wages-empty-icon`} className={`saved-wages-empty-icon`} />
            <Label id={`saved-wages-empty-title`} className={`saved-wages-empty-title`} style={styles.emptyTitle}>
              {`Save your first wage`}
            </Label>
            <Label id={`saved-wages-empty-copy`} className={`saved-wages-empty-copy`} style={styles.emptyCopy}>
              {`Press Enter in an input or use Save to keep this calculation here.`}
            </Label>
          </Box>
        )}
        {entries.map((entry) => {
          const selected = entry.id === selectedId;
          const identity = `saved-wage-${entry.id}`;
          const results = calculateWages(entry.inputs);
          const periods = results.periods.filter((period) => period.id !== `daily`);
          const fullAmounts = periods.map((period) => `${period.label}: ${formatMoney(period.gross)}`).join(`, `);
          const tooltip = Platform.OS === `web` ? { title: fullAmounts } : {};

          return (
            <Box
              key={entry.id}
              id={`${identity}-card`}
              className={`saved-wage-card${selected ? ` saved-wage-card-selected` : ``}`}
              style={[styles.card, selected && styles.selectedCard]}
            >
              <Pressable
                {...tooltip}
                accessibilityRole={`button`}
                accessibilityState={{ selected }}
                accessibilityLabel={`Load saved gross wage. ${fullAmounts}`}
                {...elementProps(`saved-wage-select`, `${identity}-select`)}
                onPress={() => {
                  onSelect(entry);
                  if (!docked) onClose();
                }}
                style={[styles.select, webClass(`saved-wage-select`)]}
              >
                <Box id={`${identity}-heading`} className={`saved-wage-heading`} style={styles.cardHeading}>
                  <Icon
                    size={14}
                    id={`${identity}-icon`}
                    className={`saved-wage-icon`}
                    icon={entry.inputs.mode === `salary` ? BriefcaseBusiness : Clock3}
                  />
                  <Label id={`${identity}-mode`} className={`saved-wage-mode`} style={styles.mode}>
                    {entry.inputs.mode === `salary` ? `Annual salary` : `Hourly pay`}
                  </Label>
                </Box>
                <Box id={`${identity}-amounts`} className={`saved-wage-amounts`} style={styles.amounts}>
                  {periods.map((period) => (
                    <Box
                      key={period.id}
                      id={`${identity}-${period.id}`}
                      className={`saved-wage-period`}
                      style={styles.period}
                      accessibilityLabel={`${period.label}: ${formatMoney(period.gross)} gross`}
                    >
                      <Label id={`${identity}-${period.id}-value`} className={`saved-wage-value`} style={styles.value}>
                        {compactMoney.format(period.gross)}
                      </Label>
                      <Label id={`${identity}-${period.id}-suffix`} className={`saved-wage-suffix`} style={styles.suffix}>
                        {periodSuffixes[period.id as keyof typeof periodSuffixes]}
                      </Label>
                    </Box>
                  ))}
                </Box>
              </Pressable>
              <Button
                icon={X}
                iconOnly
                iconSize={24}
                variant={`ghost`}
                label={`Remove saved wage`}
                id={`${identity}-remove`}
                className={`saved-wage-remove`}
                style={styles.removeButton}
                labelStyle={{ color: colors.red }}
                onPress={() => onRemove(entry.id)}
                accessibilityLabel={`Remove saved wage. ${fullAmounts}`}
              />
            </Box>
          );
        })}
      </ScrollView>
      <Box id={`saved-wages-storage`} className={`saved-wages-storage`} style={styles.storage}>
        <Label
          accessibilityLiveRegion={`polite`}
          id={`saved-wages-storage-status`}
          className={`saved-wages-storage-status`}
          style={[styles.caption, storageStatus === `unavailable` && { color: colors.red }]}
        >
          {status}
        </Label>
      </Box>
    </Box>
  );

  if (docked) {
    return (
      <Animated.View
        {...elementProps(`saved-wages-docked`, `saved-wages-docked`)}
        style={[styles.docked, { width: dockedWidth }, webClass(`saved-wages-docked`)]}
      >
        {renderRail(`docked`, open)}
        {(open || dockedMounted) && (
          <Box
            style={styles.panelContainer}
            id={`saved-wages-panel-container`}
            className={`saved-wages-panel-container`}
            pointerEvents={open ? `auto` : `none`}
            accessibilityElementsHidden={!open}
            importantForAccessibility={open ? `auto` : `no-hide-descendants`}
          >
            {panel}
          </Box>
        )}
      </Animated.View>
    );
  }

  return (
    <>
      {renderRail(`mobile`, false, open || drawerMounted)}
      <Modal
        transparent
        visible={open || drawerMounted}
        animationType={`none`}
        onRequestClose={onClose}
        {...elementProps(`saved-wages-modal`, `saved-wages-modal`)}
      >
        <Box id={`saved-wages-overlay`} className={`saved-wages-overlay`} style={styles.overlay}>
          <Pressable
            onPress={onClose}
            accessibilityRole={`button`}
            accessibilityLabel={`Close saved wages`}
            {...elementProps(`saved-wages-backdrop`, `saved-wages-backdrop`)}
            style={[styles.backdrop, webClass(`saved-wages-backdrop`)]}
          />
          <Animated.View
            accessibilityViewIsModal
            {...elementProps(`saved-wages-drawer`, `saved-wages-drawer`)}
            style={[styles.drawer, { width: drawerWidth, transform: [{ translateX: offset }] }, webClass(`saved-wages-drawer`)]}
          >
            {renderRail(`drawer`, open)}
            {panel}
          </Animated.View>
        </Box>
      </Modal>
    </>
  );
};

const createStyles = (colors: Palette) => StyleSheet.create({
  list: { flex: 1 },
  listContent: { gap: 10, padding: 14 },
  drawerPanel: { flex: 1, minWidth: 0, width: `auto`, flexShrink: 1 },
  title: { fontSize: 16, fontWeight: `600` },
  headingCopy: { gap: 3, flex: 1, minWidth: 0 },
  panelContainer: { flex: 1, minWidth: 0, height: `100%`, overflow: `hidden` },
  caption: { fontSize: 11, lineHeight: 16, color: colors.muted },
  overlay: { flex: 1, flexDirection: `row`, alignItems: `stretch` },
  select: { gap: 10, padding: 13, borderRadius: 7, minHeight: 116 },
  amounts: { rowGap: 7, flexDirection: `row`, flexWrap: `wrap` },
  suffix: { fontSize: 10, lineHeight: 20, color: colors.muted },
  mode: { fontSize: 11, fontWeight: `500`, color: colors.green },
  emptyTitle: { marginTop: 3, fontSize: 14, fontWeight: `600` },
  selectedCard: { borderColor: colors.green, backgroundColor: colors.selected },
  period: { gap: 3, width: `50%`, flexDirection: `row`, alignItems: `baseline` },
  value: { fontSize: 17, lineHeight: 22, fontWeight: `600`, letterSpacing: -0.4 },
  cardHeading: { gap: 6, minHeight: 34, paddingRight: 40, flexDirection: `row`, alignItems: `center` },
  railToggle: { width: 48, padding: 8, minWidth: 48, minHeight: 48, borderRadius: 7 },
  empty: { gap: 10, paddingVertical: 27, alignItems: `center`, paddingHorizontal: 5 },
  emptyCopy: { fontSize: 12, lineHeight: 19, textAlign: `center`, color: colors.muted },
  railCount: { minWidth: 24, padding: 4, borderRadius: 12, fontSize: 11, textAlign: `center`, color: colors.muted, backgroundColor: colors.selected },
  docked: { height: `100%`, flexShrink: 0, overflow: `hidden`, flexDirection: `row`, backgroundColor: colors.card },
  drawer: { height: `100%`, zIndex: 1, flexDirection: `row`, backgroundColor: colors.card, elevation: 12 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: `rgba(0, 0, 0, 0.38)` },
  card: { borderWidth: 1, borderRadius: 7, borderColor: colors.border, backgroundColor: colors.card },
  storage: { padding: 14, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  heading: { gap: 9, minHeight: 80, padding: 18, borderBottomWidth: 1, borderColor: colors.border, flexDirection: `row`, alignItems: `center` },
  sidebar: { width: SAVED_WAGES_PANEL_WIDTH, height: `100%`, flexShrink: 0, borderRightWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  removeButton: { top: 3, right: 3, padding: 9, width: 48, minWidth: 48, minHeight: 48, position: `absolute`, borderRadius: 7 },
  rail: { gap: 10, width: SAVED_WAGES_COLLAPSED_WIDTH, height: `100%`, flexShrink: 0, paddingTop: 16, alignItems: `center`, borderRightWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
});
