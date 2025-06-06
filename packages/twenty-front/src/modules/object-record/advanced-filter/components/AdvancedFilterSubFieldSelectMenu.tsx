import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';

import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { useSetRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentStateV2';
import { isDefined } from 'twenty-shared/utils';

import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { useAdvancedFilterFieldSelectDropdown } from '@/object-record/advanced-filter/hooks/useAdvancedFilterFieldSelectDropdown';
import { useSelectFieldUsedInAdvancedFilterDropdown } from '@/object-record/advanced-filter/hooks/useSelectFieldUsedInAdvancedFilterDropdown';
import { fieldMetadataItemIdUsedInDropdownComponentState } from '@/object-record/object-filter-dropdown/states/fieldMetadataItemIdUsedInDropdownComponentState';
import { fieldMetadataItemUsedInDropdownComponentSelector } from '@/object-record/object-filter-dropdown/states/fieldMetadataItemUsedInDropdownComponentSelector';
import { objectFilterDropdownFilterIsSelectedComponentState } from '@/object-record/object-filter-dropdown/states/objectFilterDropdownFilterIsSelectedComponentState';
import { objectFilterDropdownIsSelectingCompositeFieldComponentState } from '@/object-record/object-filter-dropdown/states/objectFilterDropdownIsSelectingCompositeFieldComponentState';
import { objectFilterDropdownSubMenuFieldTypeComponentState } from '@/object-record/object-filter-dropdown/states/objectFilterDropdownSubMenuFieldTypeComponentState';
import { subFieldNameUsedInDropdownComponentState } from '@/object-record/object-filter-dropdown/states/subFieldNameUsedInDropdownComponentState';
import { getCompositeSubFieldLabel } from '@/object-record/object-filter-dropdown/utils/getCompositeSubFieldLabel';
import { getFilterableFieldTypeLabel } from '@/object-record/object-filter-dropdown/utils/getFilterableFieldTypeLabel';
import { SETTINGS_COMPOSITE_FIELD_TYPE_CONFIGS } from '@/settings/data-model/constants/SettingsCompositeFieldTypeConfigs';
import { DropdownMenuHeader } from '@/ui/layout/dropdown/components/DropdownMenuHeader/DropdownMenuHeader';
import { DropdownMenuHeaderLeftComponent } from '@/ui/layout/dropdown/components/DropdownMenuHeader/internal/DropdownMenuHeaderLeftComponent';
import { useRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentStateV2';
import { IconApps, IconChevronLeft, MenuItem, useIcons } from 'twenty-ui';

type AdvancedFilterSubFieldSelectMenuProps = {
  recordFilterId: string;
};

export const AdvancedFilterSubFieldSelectMenu = ({
  recordFilterId,
}: AdvancedFilterSubFieldSelectMenuProps) => {
  const { getIcon } = useIcons();

  const fieldMetadataItemUsedInDropdown = useRecoilComponentValueV2(
    fieldMetadataItemUsedInDropdownComponentSelector,
  );

  const [, setObjectFilterDropdownFilterIsSelected] = useRecoilComponentStateV2(
    objectFilterDropdownFilterIsSelectedComponentState,
  );

  const [, setSubFieldNameUsedInDropdown] = useRecoilComponentStateV2(
    subFieldNameUsedInDropdownComponentState,
  );

  const [, setObjectFilterDropdownIsSelectingCompositeField] =
    useRecoilComponentStateV2(
      objectFilterDropdownIsSelectingCompositeFieldComponentState,
    );

  const [
    objectFilterDropdownSubMenuFieldType,
    setObjectFilterDropdownSubMenuFieldType,
  ] = useRecoilComponentStateV2(
    objectFilterDropdownSubMenuFieldTypeComponentState,
  );

  const setFieldMetadataItemIdUsedInDropdown = useSetRecoilComponentStateV2(
    fieldMetadataItemIdUsedInDropdownComponentState,
  );

  const { closeAdvancedFilterFieldSelectDropdown } =
    useAdvancedFilterFieldSelectDropdown(recordFilterId);

  const { selectFieldUsedInAdvancedFilterDropdown } =
    useSelectFieldUsedInAdvancedFilterDropdown();

  const handleSelectFilter = (
    selectedFieldMetadataItem: FieldMetadataItem | null | undefined,
    subFieldName?: string | null | undefined,
  ) => {
    if (!isDefined(selectedFieldMetadataItem)) {
      return;
    }

    selectFieldUsedInAdvancedFilterDropdown({
      fieldMetadataItemId: selectedFieldMetadataItem.id,
      recordFilterId,
      subFieldName,
    });

    closeAdvancedFilterFieldSelectDropdown();
  };

  const handleSubMenuBack = () => {
    setFieldMetadataItemIdUsedInDropdown(null);
    setObjectFilterDropdownSubMenuFieldType(null);
    setObjectFilterDropdownIsSelectingCompositeField(false);
    setObjectFilterDropdownFilterIsSelected(false);
    setSubFieldNameUsedInDropdown(null);
  };

  if (!isDefined(objectFilterDropdownSubMenuFieldType)) {
    return null;
  }

  const options = SETTINGS_COMPOSITE_FIELD_TYPE_CONFIGS[
    objectFilterDropdownSubMenuFieldType
  ].filterableSubFields.sort((a, b) => a.localeCompare(b));

  return (
    <>
      <DropdownMenuHeader
        StartComponent={
          <DropdownMenuHeaderLeftComponent
            onClick={handleSubMenuBack}
            Icon={IconChevronLeft}
          />
        }
      >
        {getFilterableFieldTypeLabel(objectFilterDropdownSubMenuFieldType)}
      </DropdownMenuHeader>
      <DropdownMenuItemsContainer>
        <MenuItem
          key={`select-filter-${-1}`}
          testId={`select-filter-${-1}`}
          onClick={() => {
            handleSelectFilter(fieldMetadataItemUsedInDropdown);
          }}
          LeftIcon={IconApps}
          text={`Any ${getFilterableFieldTypeLabel(objectFilterDropdownSubMenuFieldType)} field`}
        />
        {/* TODO: fix this with a backend field on ViewFilter for composite field filter */}
        {fieldMetadataItemUsedInDropdown?.type === 'ACTOR' &&
          options.map((subFieldName, index) => (
            <MenuItem
              key={`select-filter-${index}`}
              testId={`select-filter-${index}`}
              onClick={() => {
                if (isDefined(fieldMetadataItemUsedInDropdown)) {
                  handleSelectFilter(
                    fieldMetadataItemUsedInDropdown,
                    subFieldName,
                  );
                }
              }}
              text={getCompositeSubFieldLabel(
                objectFilterDropdownSubMenuFieldType,
                subFieldName,
              )}
              LeftIcon={getIcon(fieldMetadataItemUsedInDropdown?.icon)}
            />
          ))}
      </DropdownMenuItemsContainer>
    </>
  );
};
