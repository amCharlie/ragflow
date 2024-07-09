import SvgIcon from '@/components/svg-icon';
import {
  useSelectDocumentList,
  useSetDocumentStatus,
} from '@/hooks/documentHooks';
import { useSetSelectedRecord } from '@/hooks/logicHooks';
import { useSelectParserList } from '@/hooks/userSettingHook';
import { IKnowledgeFile } from '@/interfaces/database/knowledge';
import { getExtension } from '@/utils/documentUtils';
import { Flex, Switch, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useChangeDocumentParser,
  useCreateEmptyDocument,
  useFetchDocumentListOnMount,
  useGetPagination,
  useGetRowSelection,
  useHandleUploadDocument,
  useHandleWebCrawl,
  useNavigateToOtherPage,
  useRenameDocument,
} from '../add-knowledge/components/knowledge-file/hooks';
import WebCrawlModal from '../add-knowledge/components/knowledge-file/web-crawl-modal';
import SearchDocumentToolbar from './document-toolbar';
import KnowledgeBaseSelectModal from './knowledge-base-select-modal';

import { formatDate } from '@/utils/date';
import styles from './index.less';

const { Text } = Typography;

const Explorer = () => {
  const data = useSelectDocumentList();
  const { fetchDocumentList } = useFetchDocumentListOnMount();
  const parserList = useSelectParserList();
  const { pagination } = useGetPagination(fetchDocumentList);
  const onChangeStatus = useSetDocumentStatus();
  const { toChunk } = useNavigateToOtherPage();
  const { currentRecord, setRecord } = useSetSelectedRecord();
  const {
    renameLoading,
    onRenameOk,
    renameVisible,
    hideRenameModal,
    showRenameModal,
  } = useRenameDocument(currentRecord.id);
  const {
    createLoading,
    onCreateOk,
    createVisible,
    hideCreateModal,
    showCreateModal,
  } = useCreateEmptyDocument();
  const {
    changeParserLoading,
    onChangeParserOk,
    changeParserVisible,
    hideChangeParserModal,
    showChangeParserModal,
  } = useChangeDocumentParser(currentRecord.id);
  const {
    documentUploadVisible,
    hideDocumentUploadModal,
    onDocumentUploadOk,
    documentUploadLoading,
  } = useHandleUploadDocument();
  const {
    webCrawlUploadVisible,
    hideWebCrawlUploadModal,
    showWebCrawlUploadModal,
    onWebCrawlUploadOk,
    webCrawlUploadLoading,
  } = useHandleWebCrawl();
  const { t } = useTranslation('translation', {
    keyPrefix: 'knowledgeDetails',
  });

  const rowSelection = useGetRowSelection();

  const columns: ColumnsType<IKnowledgeFile> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (text: any, { id, thumbnail, name }) => (
        <div className={styles.toChunks} onClick={() => toChunk(id)}>
          <Flex gap={10} align="center">
            {thumbnail ? (
              <img className={styles.img} src={thumbnail} alt="" />
            ) : (
              <SvgIcon
                name={`file-icon/${getExtension(name)}`}
                width={24}
              ></SvgIcon>
            )}
            <Text ellipsis={{ tooltip: text }} className={styles.nameText}>
              {text}
            </Text>
          </Flex>
        </div>
      ),
    },
    {
      title: t('chunkNumber'),
      dataIndex: 'chunk_num',
      key: 'chunk_num',
    },
    {
      title: t('uploadDate'),
      dataIndex: 'create_time',
      key: 'create_time',
      render(value) {
        return formatDate(value);
      },
    },
    {
      title: t('enabled'),
      key: 'status',
      dataIndex: 'status',
      render: (_, { status, id }) => (
        <>
          <Switch
            checked={status === '1'}
            onChange={(e) => {
              onChangeStatus(e, id);
            }}
          />
        </>
      ),
    },
  ];

  const finalColumns = columns.map((x) => ({
    ...x,
    className: `${styles.column}`,
  }));

  const [kbModalVisible, setKbModalVisible] = useState(true);
  const [selectedKb, setSelectedKb] = useState(null);

  const handleKbSelect = (kb) => {
    setSelectedKb(kb);
    setKbModalVisible(false);
  };

  useEffect(() => {
    if (!selectedKb) {
      setKbModalVisible(true);
    }
  }, [selectedKb]);

  return (
    <div className={styles.datasetWrapper}>
      <SearchDocumentToolbar
        selectedRowKeys={rowSelection.selectedRowKeys as string[]}
        showCreateModal={showCreateModal}
        showWebCrawlModal={showWebCrawlUploadModal}
      ></SearchDocumentToolbar>
      <Table
        rowKey="id"
        columns={finalColumns}
        dataSource={data}
        // loading={loading}
        pagination={pagination}
        rowSelection={rowSelection}
        className={styles.documentTable}
        scroll={{ scrollToFirstRowOnChange: true, x: 1300 }}
      />

      <WebCrawlModal
        visible={webCrawlUploadVisible}
        hideModal={hideWebCrawlUploadModal}
        loading={webCrawlUploadLoading}
        onOk={onWebCrawlUploadOk}
      ></WebCrawlModal>

      <KnowledgeBaseSelectModal
        visible={kbModalVisible}
        onSelect={handleKbSelect}
        onCancel={() => setKbModalVisible(false)}
      />
    </div>
  );
};

export default Explorer;
