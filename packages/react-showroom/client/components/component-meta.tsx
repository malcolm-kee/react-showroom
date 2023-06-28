import { isDefined } from '@showroomjs/core';
import { Table, TextTooltip, tw } from '@showroomjs/ui';
import type { ComponentDoc, Props } from 'react-docgen-typescript';
import snarkdown from 'snarkdown';
import { useTargetAudience } from '../lib/use-target-audience';
import { H1 } from './base';

export interface ComponentMetaProps {
  componentData: ComponentDoc;
  propsDefaultOpen?: boolean;
  slug: string;
}

export const ComponentMeta = ({ componentData, slug }: ComponentMetaProps) => {
  const targetAudience = useTargetAudience();

  const doc = componentData;

  const tags = doc.tags as Record<string, unknown>;

  return (
    <div className={tw(['flex flex-col gap-5 w-full'])}>
      <H1>
        <span
          className={tw([
            hasTag(tags, 'deprecated') && 'line-through font-normal',
          ])}
        >
          {doc.displayName}
        </span>
      </H1>
      {doc.description && (
        <div
          dangerouslySetInnerHTML={{
            __html: snarkdown(doc.description),
          }}
        />
      )}
      {targetAudience === 'developer' && (
        <>
          <ComponentMetaTags tags={tags} />
          <ComponentPropsTable componentProps={doc.props} />
        </>
      )}
    </div>
  );
};

const ComponentPropsTable = (props: { componentProps: Props }) => {
  const componentProps = props.componentProps;

  if (Object.keys(componentProps).length === 0) {
    return null;
  }

  return (
    <>
      <Table>
        <caption
          className={tw([
            'text-sm pb-1 tracking-wide text-zinc-400 font-bold text-left',
          ])}
        >
          PROPS
        </caption>
        <thead>
          <Table.Tr>
            <Table.Th>NAME</Table.Th>
            <Table.Th>TYPE</Table.Th>
            <Table.Th>DEFAULT</Table.Th>
            <Table.Th>DESCRIPTION</Table.Th>
          </Table.Tr>
        </thead>
        <tbody>
          {Object.keys(componentProps).map((prop) => {
            const propData = componentProps[prop];

            const isDeprecated =
              propData.tags && hasTag(propData.tags, 'deprecated');

            const style = isDeprecated
              ? { textDecorationLine: 'line-through' }
              : undefined;

            return (
              <Table.Tr key={prop}>
                <Table.Td css={style}>
                  {propData.name}
                  {propData.required ? (
                    <TextTooltip label="Required" side="right">
                      <span className={tw(['text-red-700'])}>*</span>
                    </TextTooltip>
                  ) : null}
                </Table.Td>
                <Table.Td css={style}>{propData.type.raw}</Table.Td>
                <Table.Td css={style}>
                  {propData.required
                    ? '-'
                    : propData.defaultValue &&
                      isDefined(propData.defaultValue.value)
                    ? String(propData.defaultValue.value)
                    : '-'}
                </Table.Td>
                <Table.Td
                  css={style}
                  dangerouslySetInnerHTML={{
                    __html: snarkdown(propData.description),
                  }}
                />
              </Table.Tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

const ComponentMetaTags = ({ tags }: { tags: Record<string, unknown> }) => {
  const tagKeys = Object.keys(tags);

  return (
    <>
      {tagKeys.map((tag) => (
        <p key={tag}>
          <>
            <b className={tw([tag === 'deprecated' && 'capitalize'])}>{tag}</b>
            {tags[tag] && typeof tags[tag] === 'string' && `: ${tags[tag]}`}
          </>
        </p>
      ))}
    </>
  );
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasTag = (tags: Record<string, unknown>, tag: string) =>
  hasOwnProperty.call(tags, tag);
