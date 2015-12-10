package com.csc.ux.canvas.service.attribute;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.csc.ux.canvas.dao.UserLabelRecordsDAO;
import com.csc.ux.canvas.entity.UserLabelRecords;

@Service
public class UserLabelRecordsServiceImpl implements UserLabelRecordsService {

	@Autowired
	private UserLabelRecordsDAO userLabelRecordsDAO;

	@Override
	@Transactional
	public List<UserLabelRecords> getAllViews(String location, String masterCo, String policyCo, String lineBus,
			String insLine, String state, String product, String coverage, String item, String setType) {
		return userLabelRecordsDAO.getAllViews(location, masterCo, policyCo, lineBus, insLine,
				state, product, coverage, item, setType);
	}

}
