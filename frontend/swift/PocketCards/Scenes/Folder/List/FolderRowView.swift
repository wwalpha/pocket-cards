//
//  FolderRowView.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/13.
//

import SwiftUI

struct FolderRowView: View {
    var body: some View {
        HStack {
            Image(systemName: "folder")
                .font(.title)
                .frame(width: 50, height: 50, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
            
            Text("Folder Name")
            
            Spacer()
        }
    }
}

struct FolderRowView_Previews: PreviewProvider {
    static var previews: some View {
        FolderRowView()
    }
}
