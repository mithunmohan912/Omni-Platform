package com.csc.ux.canvas.dao;

import java.util.List;
import com.csc.ux.canvas.entity.UserLabelRecords;

public interface UserLabelRecordsDAO {

	public List<UserLabelRecords> getAllViews(String location, String masterCo, String policyCo, String lineBus,
			String insLine, String state, String product, String coverage, String item, String setType);

}
