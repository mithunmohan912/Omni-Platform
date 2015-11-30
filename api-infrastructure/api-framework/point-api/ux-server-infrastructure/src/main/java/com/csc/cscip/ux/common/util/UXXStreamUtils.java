package com.csc.cscip.ux.common.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.converters.UnmarshallingContext;
import com.thoughtworks.xstream.converters.collections.AbstractCollectionConverter;
import com.thoughtworks.xstream.io.ExtendedHierarchicalStreamWriterHelper;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.xml.DomDriver;
import com.thoughtworks.xstream.io.xml.XmlFriendlyReplacer;
import com.thoughtworks.xstream.mapper.Mapper;

public class UXXStreamUtils {

	public static XStream getXStream() {

		XStream xStream = new XStream(new DomDriver("UTF-8", new XmlFriendlyReplacer("$", "_")));
		xStream.registerConverter(new MapEntryConverter(xStream.getMapper()));
		return xStream;
	}

}

@SuppressWarnings("unchecked")
class MapEntryConverter extends AbstractCollectionConverter {

	public MapEntryConverter(Mapper mapper) {
		super(mapper);
	}

	@SuppressWarnings("rawtypes")
	public boolean canConvert(Class clazz) {
		return Map.class.isAssignableFrom(clazz);
	}

	public void marshal(Object value, HierarchicalStreamWriter writer, MarshallingContext context) {

		Set<Entry<String, Object>> entrySet = ((Map<String, Object>) value).entrySet();
		for (Entry<String, Object> entry : entrySet) {

			if (entry.getValue() == null || entry.getValue() instanceof String) {

				writer.startNode(entry.getKey().toString());
				writer.setValue(entry.getValue() == null ? "" : entry.getValue().toString());
				writer.endNode();

			} else {

				String name = mapper().serializedClass(entry.getValue().getClass());
				ExtendedHierarchicalStreamWriterHelper.startNode(writer, name, entry.getValue().getClass());
				context.convertAnother(entry.getValue());
				writer.endNode();
			}

		}
	}

	public Object unmarshal(HierarchicalStreamReader reader, UnmarshallingContext context) {

		Map<String, Object> map = (Map<String, Object>) context.currentObject();
		if (map == null) {
			map = new HashMap<String, Object>();
		}
		while (reader.hasMoreChildren()) {
			reader.moveDown();
			map.put(reader.getNodeName(), reader.getValue());
			reader.moveUp();
		}
		return map;
	}
}