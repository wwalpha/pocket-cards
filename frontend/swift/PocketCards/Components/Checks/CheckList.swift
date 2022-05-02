//
//  CheckList.swift
//  PocketCards
//
//  Created by macmini on 2022/04/30.
//

import SwiftUI

struct CheckListItem {
    private var id = UUID()
    var key: String
    var name: String
    var isChecked: Bool = false

    init(key: String, name: String) {
        self.key = key
        self.name = name
    }
}

struct CheckList: View {
    @State var datas: [CheckListItem] = []
    @Binding var selection: Set<String>

    var body: some View {
        List {
            ForEach(0 ..< datas.count, id: \.self) { index in
                HStack {
                    Image(systemName: datas[index].isChecked ? "checkmark.square.fill" : "square")
                        .onTapGesture {
                            datas[index].isChecked.toggle()

                            if datas[index].isChecked {
                                selection.insert(datas[index].key)
                            } else {
                                selection.remove(datas[index].key)
                            }
                        }
                    Text(datas[index].name)
                        .onTapGesture {
                            datas[index].isChecked.toggle()

                            if datas[index].isChecked {
                                selection.insert(datas[index].key)
                            } else {
                                selection.remove(datas[index].key)
                            }
                        }
                }
            }
        }
    }
}

// struct CheckList_Previews: PreviewProvider {
//    @State var selection = Set<String> ()
//
//    static var previews: some View {
//        var datas: [CheckListItem] = []
//        datas.append(CheckListItem(key: "AAA", name: "Name1"))
//        datas.append(CheckListItem(key: "BBB", name: "Name2"))
//        datas.append(CheckListItem(key: "CCC", name: "Name3"))
//
//
//        return CheckList(datas: datas, selection: $selection)
//    }
// }
