package com.csc.cscip.ux.common.util;

import java.io.IOException;

import javax.swing.JOptionPane;
import javax.swing.JTextArea;

public class EncryptInitializer {

	private static String page = "";
	private static String billNumber = "";
	private static String polNumber = "";
	private static String key = "";
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {		
		JOptionPane.showMessageDialog(null, "Welcome to the Exceed J encrypt tool.");
		String opt = "";
		boolean flag = true;		
		do{
			opt = JOptionPane.showInputDialog("Please insert the action you would like to do:\n 1- Generate a key\n 2- Encrypt Data\n 3- Exit");
			try {
				if(opt != null && !opt.isEmpty()){
					if(Integer.parseInt(opt) >= 1 && Integer.parseInt(opt) <= 3){
						switch(Integer.parseInt(opt)){
							case 1:
								String keyGen = EncryptTool.keyGenerator();
								EncryptInitializer.showSelectableMessage("Key Gen: "+keyGen);
								break;
							case 2:
								EncryptInitializer.setKeyParam();
								EncryptTool e = new EncryptTool(key,"");
								EncryptInitializer.setBillNumberPolNumberParams();								
								EncryptInitializer.setPageParam();								
								String url = "";
								if(!billNumber.isEmpty())
									url = (polNumber.isEmpty())?billNumber+"&"+page:billNumber+"&"+polNumber+"&"+page;
								else
									url = (polNumber.isEmpty())?"":polNumber+"&"+page;								
								String encryptCode = e.encrypt(url.replaceAll("\\s", ""));
								String text = "The URL "+ url + "\nThe encypt code is "+encryptCode;
								EncryptInitializer.showSelectableMessage(text);
								break;
							case 3:
								flag = false;
								break;
						}	
					}		
				}else{
					flag = true;
				}
			} catch (SecurityException e) {
				e.printStackTrace();
				flag = false;
			} catch (IOException e) {
				JOptionPane.showMessageDialog(null, "The path does not exist.");
				flag = true;
			} catch (NumberFormatException e){
				JOptionPane.showMessageDialog(null, "You should only use the option 1, 2 or 3.");
				flag = true;
			}
		} while(flag);
	}
	
	public static void setBillNumberPolNumberParams(){
		do{
			billNumber= JOptionPane.showInputDialog("Bill Account Number: ");
			polNumber = JOptionPane.showInputDialog("Policy Number: ");
			if( (billNumber == null || billNumber.isEmpty()) && (polNumber == null || polNumber.isEmpty()) ){
				JOptionPane.showMessageDialog(null, "A Bill Account Number and/or Policy Number is required");
			}
		}while((billNumber == null || billNumber.isEmpty()) && (polNumber == null || polNumber.isEmpty()));
		billNumber = (billNumber == null || billNumber.isEmpty())?"":"ba="+billNumber;
		polNumber = (polNumber == null || polNumber.isEmpty())?"":"pol="+polNumber;
	}
	
	public static void setPageParam(){
		do{
			page = JOptionPane.showInputDialog("Page code (e.g. AS = Account Summary): ");
			if(page == null || page.isEmpty()) JOptionPane.showMessageDialog(null, "The page parameter is required"); 
		}while(page == null || page.isEmpty());
		page = "page="+page;
	}
	
	public static void setKeyParam(){
		do{
			key = JOptionPane.showInputDialog("Key to encrypt the data: ");
			if(key == null || key.isEmpty()) JOptionPane.showMessageDialog(null, "The key parameter is required");
		}while(key == null || key.isEmpty());
	}
	
	public static void showSelectableMessage(String text){
		JTextArea textArea = new JTextArea(text);
		textArea.setColumns(30);
		textArea.setOpaque(false);
		textArea.setEditable(false);
		textArea.setLineWrap(true);
		textArea.setWrapStyleWord(true);					
		textArea.setSize(textArea.getPreferredSize().width, 1);
		JOptionPane.showMessageDialog(null, textArea, "Encrypt tool", JOptionPane.INFORMATION_MESSAGE);
	}

}
