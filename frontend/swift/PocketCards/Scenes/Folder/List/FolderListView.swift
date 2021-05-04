//
//  FolderListView.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/11.
//
import SwiftUI

struct FolderListView: View {
    @ObservedObject var presenter: FolderListPresenter
    
    var body: some View {
        NavigationView {
            List {
                self.presenter.linkBuilder(ViewBuilder: {
                    FolderRowView()
                })
                self.presenter.linkBuilder(ViewBuilder: {
                    FolderRowView()
                })
//                Image(systemName: "person.crop.circle.fill.badge.plus")
//                    .renderingMode(.original)
//                    .foregroundColor(.blue)
//                    .font(.largeTitle)
//
            }
            .listStyle(PlainListStyle())
            .navigationBarTitle("Folders", displayMode: .inline)
            .navigationBarItems(
//                leading:
//                    Button(action: {
//                    }) {
//                        Image(systemName: "magnifyingglass")
//                    },
                trailing:
                    HStack {
                        Button(action: {
                        }) {
                            Image(systemName: "folder.badge.plus")
                        }
                    }
            )

        }
    }
}

struct FolderListView_Previews: PreviewProvider {
    static var previews: some View {
        let presenter = FolderListPresenter()
        
        FolderListView(presenter: presenter)
    }
}
