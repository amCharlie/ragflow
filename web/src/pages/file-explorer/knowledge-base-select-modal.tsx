import { api_host } from '@/utils/api';
import { Modal, Select, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  // Add more fields as needed
}

interface KnowledgeBaseSelectModalProps {
  visible: boolean;
  onSelect: (selectedKb: KnowledgeBase) => void;
  onCancel: () => void;
}

const KnowledgeBaseSelectModal: React.FC<KnowledgeBaseSelectModalProps> = ({
  visible,
  onSelect,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${api_host}/kb/list`);
        const { retcode, data: res } = response.data;

        if (retcode === 0) {
          setKnowledgeBases(res);
        } else {
          console.error('Failed to fetch knowledge bases:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch knowledge bases:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchKnowledgeBases();
    }
  }, [visible]);

  const handleOk = () => {
    // Assuming the user selects the first knowledge base for simplicity
    if (knowledgeBases.length > 0) {
      onSelect(knowledgeBases[0]);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Select Knowledge Base"
      onOk={handleOk}
      onCancel={onCancel}
      okButtonProps={{ disabled: knowledgeBases.length === 0 }}
    >
      {loading ? (
        <Spin />
      ) : (
        <Select
          style={{ width: '100%' }}
          placeholder="Select a knowledge base"
          onChange={(value) => {
            const selectedKb = knowledgeBases.find((kb) => kb.id === value);
            if (selectedKb) {
              onSelect(selectedKb);
            }
          }}
        >
          {knowledgeBases.map((kb) => (
            <Select.Option key={kb.id} value={kb.id}>
              {kb.name}
            </Select.Option>
          ))}
        </Select>
      )}
    </Modal>
  );
};

export default KnowledgeBaseSelectModal;
